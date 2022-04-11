import Vue from 'vue';
import { Condition, Register, Flag } from "@/constants";
import { bitset } from "@/assets/bitset";
import { IriscError } from "@/classes/error";
import { TInstructionNode } from '@/classes/syntax/types';


type TMemory = {
  memstart: number,
  text: TInstructionNode[],
  labels: Record<string, number>
}

type TCPU = {
  registers: Uint32Array,
  observableRegisters: number[],
  cpsr: boolean[]
}

type TEmulatorState = {
  running: boolean,
  paused: boolean,
  step: boolean,
  delay: number,

  cpu: TCPU,
  memory: TMemory,

  previousPC: number,

  errors: IriscError[],
  hoveredError: IriscError | null
}

const data = Vue.observable<TEmulatorState>({
  running: false,
  paused: false,
  step: false,
  delay: 1000,

  cpu: {
    registers: new Uint32Array(new ArrayBuffer(4 * 16)),
    observableRegisters: Array(16).fill(0),
    cpsr: [false, false, false, false]
  },

  // memory data
  memory: {
    memstart: 0,
    text: [],
    labels: {}
  },

  previousPC: 0,

  errors: [],
  hoveredError: null
});

const getters = {
  running: () => data.running,
  paused: () => data.paused,
  step: () => data.step,
  delay: () => data.delay,

  registers: () => data.cpu.observableRegisters,
  cpsr: () => data.cpu.cpsr,

  // memory getters
  memory: () => ({
    ...data.memory,
    textSize: data.memory.text.length
  }),

  currentInstruction: () => actions.instruction(data.previousPC),

  errors: () => data.errors,
  hoveredError: () => data.hoveredError
}

const actions = {
  start: function () {
    data.running = true;
  },

  pause: function () {
    data.paused = true;
  },

  // step: function ()

  stop: function () {
    data.running = false;
    data.paused = false;
  },

  instruction: function (offset: number) : TInstructionNode {
    return data.memory.text[(offset - data.memory.memstart) / 32];
  },

  reset: function () {
    data.cpu.registers = new Uint32Array(new ArrayBuffer(4 * 16));
    this.observeRegisters();

    data.cpu.cpsr = Vue.observable([false, false, false, false]);
  },

  setEntryPoint: function () {
    if (this.hasLabel("main")) this.setRegister(Register.PC, this.label("main"));
  },

  addError(error: IriscError) {
    data.errors.push(error);

    console.log(data.errors);
  },

  hoverError(error: IriscError) {
    data.hoveredError = error;
  },

  unhoverError() {
    data.hoveredError = null;
  },

  setRegister: function (register: Register, value: number) {
    if (register === Register.PC) data.previousPC = data.cpu.registers[Register.PC];
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
        result = cpsr[Flag.N] == cpsr[Flag.V]; break;
      case Condition.GT: case Condition.LE:
        result = (cpsr[Flag.N] == cpsr[Flag.V]) && !cpsr[Flag.Z]; break;
      default:
        return true;                                          // AL flag returns true regardless
    }

    if (bits[0] === 1) result = !result;
    return result;                                   
  },
  
  setFlags: function (op1: number, op2: number, result: number, operator: string = " ") {
    let sign1: number = bitset(32, op1)[31];                          // sign of left hand operand
    let sign2: number = bitset(32, op2)[31];                          // sign of right hand operand
    let signr: number = bitset(32, result)[31];                       // sign of result
    let result_ext: number[] = bitset(33, result);                    // msb = carry bit

    Vue.set(data.cpu.cpsr, Flag.N, result_ext[31] === 1);             // msb = 1
    Vue.set(data.cpu.cpsr, Flag.Z, (result & 0xffffffff) === 0);      // first 32 bits are 0
    Vue.set(data.cpu.cpsr, Flag.C, result_ext[32] === 1);             // unsigned overflow            

    if (operator == '+') {
      Vue.set(data.cpu.cpsr, Flag.V, sign1 === sign2 && sign1 !== signr);       // two operands of the same sign result in changed sign
    }
    else if (operator == '-') {
      Vue.set(data.cpu.cpsr, Flag.V, sign1 !== sign2 && sign2 === signr);       // signs different and result sign same as subtrahend 
    }
  },

  addInstruction: function (instruction: TInstructionNode) {
    data.memory.text.push(instruction);

    console.log(data.memory.text);
  },

  addLabel: function (label: string, address: number) {
    Vue.set(data.memory.labels, label, address);
  },

  hasLabel: function (label: string) : boolean {
    return data.memory.labels[label] !== undefined;
  },

  label: function (label: string) : number {
    return data.memory.labels[label];
  },

  clearMemory: function () {
    data.memory.memstart = 0;
    data.memory.text = [];
    data.memory.labels = {};

    data.errors = [];
  }
}


export default {
  ...actions,
  ...getters
}