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

  errors: IriscError[]
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

  errors: []
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

  errors: () => data.errors
}