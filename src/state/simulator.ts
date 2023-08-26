import { bitset } from "@/assets/bitset";
import { addressModeGroup, Condition, Flag, flagExplain, Register, TTransferSize } from "@/constants";
import { IriscError, ReferenceError, RuntimeError } from "@/interpreter/error";
import { BlockTransferNode, BranchNode, DirectiveNode, LabelNode, TransferNode } from '@/syntax';
import { SingleTransferNode } from '@/syntax/transfer/SingleTransferNode';
import { TInstructionNode } from '@/syntax/types';
import Vue from 'vue';
import { TExitStatus, TSimulatorState, TSimulatorSnapshot } from './types';
import { Queue } from '@/utilities';
import clone  from 'lodash.clonedeep';

const data = Vue.observable<TSimulatorState>({
  running: false,
  paused: false,
  step: false,
  delay: 500,

  cpu: {
    registers: new Uint32Array(new ArrayBuffer(4 * 16)),
    observableRegisters: Array(16).fill(0),
    cpsr: [false, false, false, false],
    tick: 0
  },

  // memory data
  memory: {
    size: 256,
    sizes: [128, 256, 512, 1024, 2048, 4096],

    buffer: undefined,
    wordView: new Uint32Array(),
    byteView: new Uint8Array(),

    dataHeight: 0,
    dataMap: {},
    
    text: [],
    textHeight: 0,
    textMap: {},

    stackHeight: 0,
  },

  previousPC: 0,
  currentInstruction: undefined,
  wasExecuted: false,

  output: [""],
  errors: [],
  breakpoints: [],

  hoveredError: null,
  exitStatus: undefined,

  snapshots: new Queue<TSimulatorSnapshot>(500, true)
});

const getters = {
  running: () => data.running,
  paused: () => data.paused,
  step: () => data.step,
  delay: () => data.delay,

  currentTick: () => data.cpu.tick,
  registers: () => data.cpu.observableRegisters,
  cpsr: () => data.cpu.cpsr,
  memory: () => ({
    ...data.memory,
    exitPoint: data.memory.size + 4
  }),

  // currentInstruction: () => actions.instruction(data.previousPC),
  currentInstruction: () => data.currentInstruction,
  previousPC: () => data.previousPC,
  wasExecuted: () => data.wasExecuted,

  output: () => data.output,
  errors: () => data.errors,
  breakpoints: () => data.breakpoints,

  hoveredError: () => data.hoveredError,
  exitStatus: () => data.exitStatus,

  snapshots: () => data.snapshots
}

const actions = {
  init: function (memSize?: number) {
    data.running = false;
    data.paused = false;
    data.step = false;
  
    actions.initMemory(memSize);
    actions.reset();
  },

  reset: function () {
    data.cpu.registers = new Uint32Array(new ArrayBuffer(4 * 16));
    this.setRegister(Register.SP, data.memory.size);
    this.setRegister(Register.LR, data.memory.size + 4);    // one word after total memory
    this.observeRegisters();

    data.cpu.tick = 0;
    data.cpu.cpsr = Vue.observable([false, false, false, false]);
    data.output = [""];
    data.exitStatus = undefined;

    data.currentInstruction = undefined;

    data.snapshots = new Queue<TSimulatorSnapshot>(500, true);
    this.takeSnapshot();
  },

  start: function () {
    data.running = true;
  },

  pause: function () {
    data.paused = true;
  },

  resume: function () {
    data.paused = false;
  },

  setStep: function (value: boolean) {
    data.step = value;
  },

  stop: function () {
    data.running = false;
    data.paused = false;
  },

  setDelay(delay: number) : void {
    data.delay = delay;
  },

  tick: function () {
    data.cpu.tick++;
  },

  instruction: function (offset: number) : TInstructionNode {
    if (offset > data.memory.textHeight) {
      throw new RuntimeError(`SIGSEG: Segmentation fault.`, [], -1);
    }
    if (offset % 4 !== 0) {
      throw new RuntimeError("SIGBUS: Bus error - misaligned access.", [], -1);
    }

    return data.memory.text[offset / 4];
  },

  setEntryPoint: function () {
    if (this.hasLabel("main")) this.setRegister(Register.PC, this.label("main"));
  },

  addOutput(output: string) {
    [...output].forEach(char => {
      if (char === '\n') data.output.push("");
      else {
        const lastLine = data.output.length -1;
        const existingLine = data.output[lastLine];
        
        Vue.set(data.output, lastLine, `${existingLine}${char}`);
      }
    })
  },

  addError(error: IriscError) {
    data.errors.push(error);
  },

  hoverError(error: IriscError) {
    data.hoveredError = error;
  },

  unhoverError() {
    data.hoveredError = null;
  },

  toggleBreakpoint: function (lineNumber: number) {
    console.log(lineNumber);
    
    console.log(data.memory.text);
    const instruction = data.memory.text.find(e => e.lineNumber === lineNumber);
    console.log(instruction);

    if (instruction) {
      const breakpoint = data.breakpoints.find(e => e.lineNumber === instruction?.lineNumber);
      if (breakpoint) {
        data.breakpoints = data.breakpoints.filter(e => e.lineNumber !== breakpoint?.lineNumber)
      }
      else {
        data.breakpoints.push(instruction);
      }
    }
  },

  removeBreakpoints: function () {
    data.breakpoints = [];
  },

  setRegister: function (register: Register, value: number) {
    if (register === Register.PC) {
      data.previousPC = data.cpu.registers[Register.PC];
      data.currentInstruction = this.instruction(data.cpu.registers[Register.PC]);
    }
    Vue.set(data.cpu.registers, register, value);

    this.observeRegisters();
  },

  observeRegisters: function () {
    data.cpu.observableRegisters = [...data.cpu.registers];
  },

  checkFlags: function (cond: Condition) : boolean {
    const bits = bitset(4, cond);
    const cpsr = data.cpu.cpsr;

    let result: boolean = false;
    switch(cond) {
      case Condition.EQ: case Condition.NE:                       // equality
        result = cpsr[Flag.Z]; break;
      case Condition.CS: case Condition.CC:
        result = cpsr[Flag.C]; break;
      case Condition.MI: case Condition.PL:
        result = cpsr[Flag.N]; break;
      case Condition.VS: case Condition.VC:
        result = cpsr[Flag.V]; break;
      case Condition.HI: case Condition.LS:
        result = cpsr[Flag.C] && !cpsr[Flag.Z]; break;
      case Condition.GE: case Condition.LT:
        result = cpsr[Flag.N] === cpsr[Flag.V]; break;
      case Condition.GT: case Condition.LE:
        result = (cpsr[Flag.N] === cpsr[Flag.V]) && !cpsr[Flag.Z]; break;
      default:
        return true;                                          // AL flag returns true regardless
    }

    // check top bit of condition code for logic reversal
    if (bits[0] === 1) result = !result;
    return result;                                   
  },
  
  setFlags: function (op1: number, op2: number, result: number, operator: string = " ") {
    const sign1: number = bitset(32, op1)[31];             // sign of left hand operand
    const sign2: number = bitset(32, op2)[31];             // sign of right hand operand
    const signr: number = bitset(32, result)[31];          // sign of result
    const result_ext: number[] = bitset(33, result);       // msb = carry bit
    
    const cpsr = [false, false, false, false];
    
    cpsr[Flag.N] = result_ext[31] === 1;                    // msb = 1
    cpsr[Flag.Z] = (result & 0xffffffff) === 0              // first 32 bits are 0 

    if (operator === '+') {
      cpsr[Flag.C] = result_ext[32] === 1                   // unsigned overflow
      cpsr[Flag.V] = sign1 === sign2 && sign1 !== signr     // two operands of the same sign result in changed sign
    }
    else if (operator === '-') {
      cpsr[Flag.C] = !(result_ext[32] === 1)                // unsigned underflow    
      cpsr[Flag.V] = sign1 !== sign2 && sign2 === signr     // signs different and result sign same as subtrahend 
    }

    Vue.set(data.cpu, 'cpsr', cpsr);
  },

  // memory actions
  initMemory: function (memSize?: number) {
    if (memSize !== undefined) data.memory.size = memSize;
    
    data.memory.text = [];
    data.memory.buffer = new ArrayBuffer(data.memory.size);
    data.memory.byteView = new Uint8Array(data.memory.buffer);
    data.memory.wordView = new Uint32Array(data.memory.buffer);

    const uninitialisedMemory = Array.from({length: data.memory.size}, () => Math.floor(Math.random() * 256));
    uninitialisedMemory.forEach((byte, address) => {
      data.memory.byteView[address] = byte;
    });
    
    data.memory.textHeight = 0;
    data.memory.dataHeight = 0;
    data.memory.stackHeight = 0;
    data.memory.textMap = {};

    data.errors = [];
    data.exitStatus = undefined;
  },

  setTextHeight: function (height: number) {
    data.memory.textHeight = height;
  },

  setInstructions: function (instructions: TInstructionNode[]) {
    data.memory.text = instructions;

    instructions.forEach((instruction, index) => {
      const bitcode = instruction.assemble().bitcode;
      const deccode = parseInt(bitcode.join(""), 2);
      const bits = deccode.toString(2);

      console.log(bitcode, deccode, bits, `store at ${index}`);
      data.memory.wordView.set([deccode], index);

      console.log(data.memory.wordView[index]);
      console.log(
        data.memory.byteView[(index * 4)], 
        data.memory.byteView[(index * 4) + 1], 
        data.memory.byteView[(index * 4) + 2], 
        data.memory.byteView[(index * 4) + 3]
      )
    });
  },

  addLabel: function (label: string, address: number) {
    Vue.set(data.memory.textMap, label, address);
  },

  hasLabel: function (label: string) : boolean {
    return data.memory.textMap[label] !== undefined;
  },

  label: function (label: string) : number {
    return data.memory.textMap[label];
  },

  allocateHeap: function (heap: Uint8Array, height: number, map: Record<string, number>) {
    data.memory.byteView?.set(heap.slice(0, height), data.memory.textHeight);
    data.memory.dataHeight = height;

    for (const label in map) map[label] = map[label] + data.memory.textHeight;
    data.memory.dataMap = map;
  },

  dataLabel: function (label: string) : number {
    return data.memory.dataMap[label];
  },

  store: function (toStore: number, address: number, size: TTransferSize) {
    console.log("storing", toStore, `(${size})`, "at address", address)
    if (size === "word") {
      data.memory.wordView[address / 4] = toStore;
    }
    else if (size === "byte") {
      data.memory.byteView[address] = toStore;
    }
  },

  setCurrentInstruction: function (instruction: TInstructionNode) {
    data.currentInstruction = instruction;
  },

  takeSnapshot: function () {
    const snapshot: TSimulatorSnapshot = {
      cpu: clone(data.cpu),
      memory: clone(data.memory),

      running: data.running,
      previousPC: data.previousPC,
      currentInstruction: data.currentInstruction,
      wasExecuted: data.wasExecuted,

      output: clone(data.output),
      exitStatus: clone(data.exitStatus)
    };

    // enqueue snapshot or replace if snapshot at that tick already exists
    data.snapshots.enqueue(snapshot, (existingSnapshot) => existingSnapshot.cpu.tick === snapshot.cpu.tick );
  },

  reinstateSnapshot: function (tick: number) {
    const state = data.snapshots.data().find(e => e.cpu.tick === tick);
    if (!state) throw Error;

    data.cpu = clone(state.cpu);
    data.memory = clone(state.memory);

    data.running = state.running;
    data.paused = true;

    data.previousPC = state.previousPC;
    data.currentInstruction = state.currentInstruction;
    data.wasExecuted = state.wasExecuted;

    data.output = clone(state.output);
    data.exitStatus = clone(state.exitStatus);
  },

  setExecuted: function (executed: boolean) {
    data.wasExecuted = executed;
  },

  setStackHeight: function (height: number) {
    data.memory.stackHeight = height;
  },

  /**
   * 
   * @param transfer 
   * @returns 
   */
  getMemoryAccessRange: function (transfer: TransferNode, snapshot?: TSimulatorSnapshot) {
    if (!snapshot) {
      snapshot = data as TSimulatorSnapshot;
    }

    if (transfer instanceof BlockTransferNode) {
      const [op, cond, base, reglist, mode, wb] = transfer.unpack();

      const address = snapshot.cpu.registers[base as Register];
      const isIncrement = addressModeGroup.increment.includes(mode);
      const nRegisters = reglist.length;

      if (isIncrement) {
        return {
          base: address,
          limit: address + (nRegisters * 4)
        }
      }
      else {
        return {
          base: address - (nRegisters * 4),
          limit: address
        }
      }
    }
    else if (transfer instanceof SingleTransferNode) {
      const [op, cond, size, reg, addr, sign, flex, mode, wb] = transfer.unpack();
      let address: number;

      if (typeof addr === "string") {
        address = snapshot.memory.dataMap[addr];
      }
      else {
        address = snapshot.cpu.registers[addr as Register];
      }

      if (size === "word") {
        if (sign === '+') {
          return {
            base: address,
            limit: address + 4
          }
        }
        else {
          return {
            base: address - 4,
            limit: address
          }
        }
      }
      else if (size === "byte") {
        if (sign === '+') {
          return {
            base: address,
            limit: address + 1
          }
        }
        else {
          return {
            base: address - 1,
            limit: address
          }
        }
      }
    }
  },

  validate: function () {
    data.memory.text.forEach(ins => {
      if (ins instanceof LabelNode) {
        if (data.memory.textMap[ins.identifier] === undefined) {
          this.addError(new ReferenceError(`Missing reference to '${ins.identifier}'`, ins.statement, ins.lineNumber, 1));
        }
      }
      else if (ins instanceof BranchNode) {
        if (typeof ins.Rd === 'string') {
          if (data.memory.textMap[ins.Rd] === undefined) {
            this.addError(new ReferenceError(`Missing reference to '${ins.Rd}'`, ins.statement, ins.lineNumber, 1));
          }
        }
      }
      else if (ins instanceof SingleTransferNode && ins.isLiteral) {
        if (data.memory.dataMap[ins.literal] === undefined) {
          this.addError(new ReferenceError(`Missing reference to '${ins.literal}'`, ins.statement, ins.lineNumber, 3));
        }
      }
      // else if (instruction instanceof BlockTransferNode) {

      // }
    });
  },

  // on simulation finish
  setExitStatus: function (status: TExitStatus) {
    data.exitStatus = status;
    this.stop();
  }
}

actions.init();

export default {
  ...actions,
  ...getters
}