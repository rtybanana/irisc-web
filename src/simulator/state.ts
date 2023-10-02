import { Queue } from '@/utilities';
import { TAllocation, TDeclaration, TSimulatorSnapshot, TSimulatorState } from './types';
import Vue from 'vue';
import { TSnapshotExplanation } from '@/explainer';

export const state = Vue.observable<TSimulatorState>({
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

    text: [],
    textHeight: 0,
    textMap: {},

    dataHeight: 0,
    dataTable: {},
    dataMap: new Map<number, TDeclaration>(),
    
    heapHeight: 0,
    heapMap: new Map<number, TAllocation>(),

    stackHeight: 0,
  },

  previousPC: 0,
  currentInstruction: undefined,
  wasExecuted: false,

  stdin: undefined,
  interrupted: false,

  output: [""],
  errors: [],
  breakpoints: [],

  hoveredError: null,
  exitStatus: undefined,

  explanation: {} as TSnapshotExplanation,
  snapshots: new Queue<TSimulatorSnapshot>(500, true),
  vue: undefined
});