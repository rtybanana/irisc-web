import { Register } from "@/constants";
import { Queue } from "@/utilities";
import { data } from "../data";
import Vue from 'vue';
import { TSimulatorSnapshot } from "../types";
import { cpu } from "./cpu";
import { TInstructionNode } from "@/syntax/types";
import { runtime } from "./runtime";
import { LabelNode, BranchNode, SingleTransferNode } from "@/syntax";
import { snapshots } from "./snapshots";
import { interaction } from "./interaction";
import { ReferenceError } from "@/interpreter";


export const init = {
	init: function (memSize?: number) {
		console.log("initialising...");
		
		data.running = false;
		data.paused = false;
		data.step = false;

		this.initMemory(memSize);
		this.reset();
	},

	reset: function () {
		data.cpu.registers = new Uint32Array(new ArrayBuffer(4 * 16));
		cpu.setRegister(Register.SP, data.memory.size);
		cpu.setRegister(Register.LR, data.memory.size + 4);    // one word after total memory
		cpu.observeRegisters();

		data.cpu.tick = 0;
		data.cpu.cpsr = Vue.observable([false, false, false, false]);
		data.output = [""];
		data.exitStatus = undefined;

		data.currentInstruction = undefined;

		data.snapshots = new Queue<TSimulatorSnapshot>(500, true);
		snapshots.takeSnapshot();
	},

	initMemory: function (memSize?: number) {
    if (memSize !== undefined) data.memory.size = memSize;
    
    data.memory.text = [];
    data.memory.buffer = new ArrayBuffer(data.memory.size);
    data.memory.byteView = new Uint8Array(data.memory.buffer);
    data.memory.wordView = new Uint32Array(data.memory.buffer);

    const uninitialisedMemory = Array.from({length: data.memory.size}, () => Math.floor(Math.random() * 256));
    uninitialisedMemory.forEach((byte, address) => {
      data.memory.byteView[address] = byte;
    });
    
    data.memory.textHeight = 0;
    data.memory.dataHeight = 0;
    data.memory.stackHeight = 0;
    data.memory.textMap = {};

    data.errors = [];
    data.exitStatus = undefined;
  },

	setEntryPoint: function () {
    if (runtime.hasLabel("main")) cpu.setRegister(Register.PC, runtime.label("main"));
  },

	setTextHeight: function (height: number) {
    data.memory.textHeight = height;
  },

  setInstructions: function (instructions: TInstructionNode[]) {
    data.memory.text = instructions;
    this.validate();

    instructions.forEach((instruction, index) => {
      const bitcode = instruction.assemble().bitcode;
      const deccode = parseInt(bitcode.join(""), 2);
      const bits = deccode.toString(2);

      console.log(bitcode, deccode, bits, `store at ${index}`);
      data.memory.wordView.set([deccode], index);

      console.log(data.memory.wordView[index]);
      console.log(
        data.memory.byteView[(index * 4)], 
        data.memory.byteView[(index * 4) + 1], 
        data.memory.byteView[(index * 4) + 2], 
        data.memory.byteView[(index * 4) + 3]
      )
    });
  },

  setTextSection: function (instructions: TInstructionNode[]) {
    
  },

  addLabel: function (label: string, address: number) {
    Vue.set(data.memory.textMap, label, address);
  },

	allocateData: function (heap: Uint8Array, height: number, map: Record<string, number>) {
    data.memory.byteView?.set(heap.slice(0, height), data.memory.textHeight);
    data.memory.dataHeight = height;

    for (const label in map) map[label] = map[label] + data.memory.textHeight;
    data.memory.dataMap = map;
  },

	validate: function () {
    data.memory.text.forEach(ins => {
      if (ins instanceof LabelNode) {
        if (data.memory.textMap[ins.identifier] === undefined) {
          interaction.addError(new ReferenceError(`Missing reference to '${ins.identifier}'`, ins.statement, ins.lineNumber, 1));
        }
      }
      else if (ins instanceof BranchNode) {
        if (typeof ins.Rd === 'string') {
          if (data.memory.textMap[ins.Rd] === undefined) {
            interaction.addError(new ReferenceError(`Missing reference to '${ins.Rd}'`, ins.statement, ins.lineNumber, 1));
          }
        }
      }
      else if (ins instanceof SingleTransferNode && ins.isLiteral) {
        if (data.memory.dataMap[ins.literal] === undefined) {
          interaction.addError(new ReferenceError(`Missing reference to '${ins.literal}'`, ins.statement, ins.lineNumber, 3));
        }
      }
      // else if (instruction instanceof BlockTransferNode) {

      // }
    });
  },
}