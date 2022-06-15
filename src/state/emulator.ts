import Vue from 'vue';
import { Condition, Register, Flag, TTransferSize } from "@/constants";
import { bitset } from "@/assets/bitset";
import { IriscError, ReferenceError, RuntimeError } from "@/classes/error";
import { TInstructionNode } from '@/classes/syntax/types';
import { AllocationNode, LabelNode } from '@/classes/syntax';
import { SingleTransferNode } from '@/classes/syntax/transfer/SingleTransferNode';
// import { EmulatorState } from '.';
import { TEmulatorState, TExitStatus } from './types';
import { TransferNode } from '@/classes/syntax/transfer/TransferNode';

const data = Vue.observable<TEmulatorState>({
  running: false,
  paused: false,
  step: false,
  delay: 500,

  cpu: {
    registers: new Uint32Array(new ArrayBuffer(4 * 16)),
    observableRegisters: Array(16).fill(0),
    cpsr: [false, false, false, false]
  },

  // memory data
  memory: {
    size: 256,
    sizes: [128, 256, 512, 1024, 2048, 4096],

    buffer: undefined,
    wordView: new Uint32Array(),
    byteView: new Uint8Array(),

    heapHeight: 0,
    heapMap: {},
    
    text: [],
    textHeight: 0,
    textMap: {},

    stackHeight: 0,
  },

  previousPC: 0,
  currentInstruction: undefined,
  wasExecuted: false,

  errors: [],
  hoveredError: null,
  exitStatus: undefined,
});

const getters = {
  running: () => data.running,
  paused: () => data.paused,
  step: () => data.step,
  delay: () => data.delay,

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
  errors: () => data.errors,
  hoveredError: () => data.hoveredError,

  exitStatus: () => data.exitStatus
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

    data.cpu.cpsr = Vue.observable([false, false, false, false]);
    data.exitStatus = undefined;
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

  addError(error: IriscError) {
    data.errors.push(error);
  },

  hoverError(error: IriscError) {
    data.hoveredError = error;
  },

  unhoverError() {
    data.hoveredError = null;
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
    let bits = bitset(4, cond);
    let cpsr = data.cpu.cpsr;

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
    let sign1: number = bitset(32, op1)[31];             // sign of left hand operand
    let sign2: number = bitset(32, op2)[31];             // sign of right hand operand
    let signr: number = bitset(32, result)[31];          // sign of result
    let result_ext: number[] = bitset(33, result);                    // msb = carry bit

    Vue.set(data.cpu.cpsr, Flag.N, result_ext[31] === 1);             // msb = 1
    Vue.set(data.cpu.cpsr, Flag.Z, (result & 0xffffffff) === 0);      // first 32 bits are 0 

    if (operator === '+') {
      Vue.set(data.cpu.cpsr, Flag.C, result_ext[32] === 1);                     // unsigned overflow           
      Vue.set(data.cpu.cpsr, Flag.V, sign1 === sign2 && sign1 !== signr);       // two operands of the same sign result in changed sign
    }
    else if (operator === '-') {
      Vue.set(data.cpu.cpsr, Flag.C, !(result_ext[32] === 1));                  // unsigned underflow           
      Vue.set(data.cpu.cpsr, Flag.V, sign1 !== sign2 && sign2 === signr);       // signs different and result sign same as subtrahend 
    }
  },

  // memory actions
  initMemory: function (memSize?: number) {
    if (memSize !== undefined) data.memory.size = memSize;
    
    data.memory.text = [];
    data.memory.buffer = new ArrayBuffer(data.memory.size);
    data.memory.byteView = new Uint8Array(data.memory.buffer);
    data.memory.wordView = new Uint32Array(data.memory.buffer);
    data.memory.textHeight = 0;
    data.memory.heapHeight = 0;
    data.memory.stackHeight = 0;
    data.memory.textMap = {};

    data.errors = [];
    data.exitStatus = undefined;
  },

  setInstructions: function (instructions: TInstructionNode[]) {
    data.memory.text = instructions;
    data.memory.textHeight = instructions.length * 4;
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
    data.memory.heapHeight = height;

    for (let label in map) map[label] = map[label] + data.memory.textHeight;
    data.memory.heapMap = map;
  },

  dataLabel: function (label: string) : number {
    return data.memory.heapMap[label];
  },

  store: function (toStore: number, address: number, size: TTransferSize) {
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

  setExecuted: function (executed: boolean) {
    data.wasExecuted = executed;
  },

  setStackHeight: function (height: number) {
    data.memory.stackHeight = height;
  },

  validate: function () {
    data.memory.text.forEach(ins => {
      if (ins instanceof LabelNode) {
        if (data.memory.textMap[ins.identifier] === undefined) {
          this.addError(new ReferenceError(`Missing reference to '${ins.identifier}'`, ins.statement, ins.lineNumber, -1));
        }
      }
      else if (ins instanceof SingleTransferNode && ins.isLiteral) {
        if (data.memory.heapMap[ins.literal] === undefined) {
          this.addError(new ReferenceError(`Missing reference to '${ins.literal}'`, ins.statement, ins.lineNumber, -1));
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