import Vue from 'vue';
import { Memory, Registers } from '@/classes/emulator';

type EmulatorState = {
  registers: Registers,
  memory: Memory
}

const data = Vue.observable<EmulatorState>({
  registers: new Registers(),
  memory: new Memory()
});

const getters = {
  registers: () => data.registers.registers,
  cpsr: () => data.registers.cpsr,

  // cpu: () => ({
  //   registers: data.registers.registers,
  //   cpsr: data.registers.cpsr
  // }),
  // memory: () => ({
  //   text:
  // })
}

const actions = {
  
}

export default {
  getters, actions
}