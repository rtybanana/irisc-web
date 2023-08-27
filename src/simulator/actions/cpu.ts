import { bitset } from "@/assets/bitset";
import { Register, Condition, Flag } from "@/constants";
import Vue from 'vue';
import { state } from "../state";
import { memory } from "./memory";

export const cpu = {
	tick: function () {
    state.cpu.tick++;
  },
	
  setRegister: function (register: Register, value: number) {
    if (register === Register.PC) {
      state.previousPC = state.cpu.registers[Register.PC];
      state.currentInstruction = memory.instruction(state.cpu.registers[Register.PC]);
    }
    Vue.set(state.cpu.registers, register, value);

    this.observeRegisters();
  },

  observeRegisters: function () {
    state.cpu.observableRegisters = [...state.cpu.registers];
  },

  checkFlags: function (cond: Condition) : boolean {
    const bits = bitset(4, cond);
    const cpsr = state.cpu.cpsr;

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
    
    let cpsr = [false, false, false, false];
    
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

    Vue.set(state.cpu, 'cpsr', cpsr);
  },
}