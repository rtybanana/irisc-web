import { Queue } from '@/utilities';
import { TSimulatorSnapshot, TSimulatorState } from './types';
import Vue from 'vue';

export const data = Vue.observable<TSimulatorState>({
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

    observableWordView: [],
    observableByteView: [],

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