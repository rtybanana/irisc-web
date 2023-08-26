import { data } from './data';

export const getters = {
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

  byteView: () => data.memory.observableByteView,
  wordView: () => data.memory.observableWordView,

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