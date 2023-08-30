import { Register } from "@/constants";
import { Queue } from "@/utilities";
import { state } from "../state";
import Vue from 'vue';
import { TAllocation, TSimulatorSnapshot } from "../types";
import { cpu } from "./cpu";
import { TInstructionNode } from "@/syntax/types";
import { memory } from "./memory";
import { LabelNode, BranchNode, SingleTransferNode } from "@/syntax";
import { snapshots } from "./snapshots";
import { interaction } from "./interaction";
import { ReferenceError } from "@/interpreter";


export const init = {
	init: function (memSize?: number) {
		// state.running = false;
		// state.paused = false;
		// state.step = false;

		this.initMemory(memSize);
		this.reset();
	},

  setVueInstance: function (vue: Vue) {
    state.vue = vue;
  },

	reset: function () {
    state.running = false;
		state.paused = false;
		state.step = false;

		state.cpu.registers = new Uint32Array(new ArrayBuffer(4 * 16));
		cpu.setRegister(Register.SP, state.memory.size);
		cpu.setRegister(Register.LR, state.memory.size + 4);    // one word after total memory
		cpu.observeRegisters();

		state.cpu.tick = 0;
		state.cpu.cpsr = Vue.observable([false, false, false, false]);
		state.output = [""];
		state.exitStatus = undefined;

		state.currentInstruction = undefined;
	},

	initMemory: function (memSize?: number) {
    if (memSize !== undefined) state.memory.size = memSize;

    state.memory.textHeight = 0;
    state.memory.textMap = {};

    state.memory.dataHeight = 0;
    state.memory.dataMap = {};

    state.memory.heapHeight = 0;
    state.memory.heapMap = new Map<number, TAllocation>();

    state.memory.stackHeight = 0;
    
    state.memory.text = [];
    state.memory.buffer = new ArrayBuffer(state.memory.size);
    state.memory.byteView = new Uint8Array(state.memory.buffer);
    state.memory.wordView = new Uint32Array(state.memory.buffer);

    const uninitialisedMemory = Array.from({length: state.memory.size}, () => Math.floor(Math.random() * 256));
    uninitialisedMemory.forEach((byte, address) => {
      state.memory.byteView[address] = byte;
    });

    // observe memory to make ArrayBuffer views Vue.Observable
    memory.observeMemory();
  
    state.errors = [];
    state.exitStatus = undefined;

    state.snapshots = new Queue<TSimulatorSnapshot>(500, true);
  },

	setEntryPoint: function () {
    if (memory.hasLabel("main")) cpu.setRegister(Register.PC, memory.label("main"));
  }
}