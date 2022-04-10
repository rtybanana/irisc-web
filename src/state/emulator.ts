import Vue from 'vue';
// import { Memory, Registers } from '@/classes/emulator';
import { Operation, Condition, Register, Shift, Flag } from "@/constants";
import { BiOperandNode, FlexOperand, InstructionNode } from '@/classes/syntax';
import { rotr, bitset } from "@/assets/bitset";
import { IriscError, RuntimeError } from "@/classes/error";
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
    data.cpu.cpsr = Vue.observable([false, false, false, false]);
    this.cpu.observeRegisters();
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

  /**
   * cpu actions
   */
  cpu: {
    setRegister: function (register: Register, value: number) {
      Vue.set(data.cpu.registers, register, value);
      this.observeRegisters();
    },

    observeRegisters: function () {
      data.cpu.observableRegisters = [...data.cpu.registers];
    },
  
    checkFlags: function (cond: Condition) : boolean {
      console.log("checking flags");
      console.log(cond);

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
      console.log("setting flags");

      let sign1: number = bitset(32, op1)[31];                          // sign of left hand operand
      let sign2: number = bitset(32, op2)[31];                          // sign of right hand operand
      let signr: number = bitset(32, result)[31];                       // sign of result
      let result_ext: number[] = bitset(33, result);                    // msb = carry bit

      console.log(sign1, sign2, signr, result_ext);

      console.log(`${result_ext[31]} === 1`, result_ext[31] === 1);
      Vue.set(data.cpu.cpsr, Flag.N, result_ext[31] === 1);             // msb = 1

      console.log(`${(result & 0xffffffff)} === 0`, (result & 0xffffffff) === 0);
      Vue.set(data.cpu.cpsr, Flag.Z, (result & 0xffffffff) === 0);      // first 32 bits are 0

      console.log(`${result_ext[32]} === 1`, result_ext[32] === 1);
      Vue.set(data.cpu.cpsr, Flag.C, result_ext[32] === 1);             // unsigned overflow            
  
      if (operator == '+') {
        Vue.set(data.cpu.cpsr, Flag.V, sign1 === sign2 && sign1 !== signr);       // two operands of the same sign result in changed sign
      }
      else if (operator == '-') {
        Vue.set(data.cpu.cpsr, Flag.V, sign1 !== sign2 && sign2 === signr);       // signs different and result sign same as subtrahend 
      }

      console.log(data.cpu.cpsr);
    },
  },

  /**
   * memory actions
   */
  memory: {
    addInstruction: function (instruction: TInstructionNode) {
      data.memory.text.push(instruction);
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

    clear: function () {
      data.memory.memstart = 0;
      data.memory.text = [];
      data.memory.labels = {};

      data.errors = [];
    }
  },

  /**
   * 
   * @param instruction 
   */
  execute: function (instruction: TInstructionNode) {
    let executed: boolean = false;

    console.log("execute", instruction);
    if (instruction instanceof BiOperandNode) executed = executeBiOperand(instruction);
  },

}

function deflex(flex: FlexOperand) : number {
  let deflex: number;

  let [Rm, shift, Rs, immShift] = flex.unpack();
  if (flex.isImm) return rotr(Rm as number, immShift);      // return value of immediate (short circuit)
  else deflex = data.cpu.registers[Rm as Register];               // get value in register

  if (flex.shifted) {
    let shiftBy: number;
    if (flex.shiftedByImm) shiftBy = Rs as number;          // get value of immediate shift
    else shiftBy = data.cpu.registers[Rs as Register];            // get value in shift register

    deflex = applyFlexShift(shift as Shift, deflex, shiftBy);                       // apply the unpacked shift
  }
  
  return deflex;
}

function applyFlexShift(shift: Shift, value: number, amount: number) : number {
  switch(shift) {
    case Shift.LSL:
      return value <<= amount;
    case Shift.LSR:
      if (amount == 0) amount = 32;       // special case for right shifts
      return value >>= amount;
    case Shift.ROR:
      return rotr(value, amount);
    default:
      throw new RuntimeError("While attempting to perform a flex operand optional shift.", [], -1, -1);
  }
}

function executeBiOperand(instruction: BiOperandNode) : boolean {
  let [op, cond, set, dest, flex] = instruction.unpack();           // unpack the instruction
  if (!actions.cpu.checkFlags(cond)) return false;                            // returns early if condition code is not satisfied

  console.log(op, cond, set, dest, flex);

  let src: number = deflex(flex);                                        // deflex the flex operand into a single value
  switch(op) {                                                        // check opcode and execute instruction
    case Operation.MOV:
      if (set) actions.cpu.setFlags(data.cpu.registers[dest], src, src);
      actions.cpu.setRegister(dest, src);
      break;
    case Operation.MVN:
      if (set) actions.cpu.setFlags(data.cpu.registers[dest], -src, -src);
      actions.cpu.setRegister(dest, -src);
      break;
    case Operation.CMP:
      actions.cpu.setFlags(data.cpu.registers[dest], src, data.cpu.registers[dest] - src, '-');
      break;
    case Operation.CMN:
      actions.cpu.setFlags(data.cpu.registers[dest], src, data.cpu.registers[dest] + src, '+');
      break;
    case Operation.TST:
      actions.cpu.setFlags(data.cpu.registers[dest], src, data.cpu.registers[dest] & src);
      break;
    case Operation.TEQ:
      actions.cpu.setFlags(data.cpu.registers[dest], src, data.cpu.registers[dest] ^ src);
      break;
  }

  // if (response) {
  //   if (op == syntax::MOV || op == syntax::MVN) registers.printIndex(dest); 
  //   if (set) registers.printCPSR();
  // }

  return true;
}

export default {
  ...actions,
  getters
}