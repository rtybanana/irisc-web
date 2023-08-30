import { state } from './state';

export const getters = {
  running: () => state.running,
  paused: () => state.paused,
  step: () => state.step,
  delay: () => state.delay,

  currentTick: () => state.cpu.tick,
  registers: () => state.cpu.observableRegisters,
  cpsr: () => state.cpu.cpsr,
  memory: () => ({
    ...state.memory,
    exitPoint: state.memory.size + 4
  }),

  byteView: () => state.memory.observableByteView,
  wordView: () => state.memory.observableWordView,
  heapBase: () => state.memory.textHeight + state.memory.dataHeight,

  // currentInstruction: () => actions.instruction(data.previousPC),
  currentInstruction: () => state.currentInstruction,
  previousPC: () => state.previousPC,
  wasExecuted: () => state.wasExecuted,

  output: () => state.output,
  errors: () => state.errors,
  breakpoints: () => state.breakpoints,

  hoveredError: () => state.hoveredError,
  exitStatus: () => state.exitStatus,

  snapshots: () => state.snapshots,
  vue: () => state.vue
}