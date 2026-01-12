import { RuntimeError, ReferenceError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode, LabelNode, BranchNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";
import { memory } from ".";
import { snapshots } from "../snapshots";
import { interaction } from "../interaction";

export const text = {
	setTextHeight: function (height: number) {
    state.memory.textHeight = height;
  },

  setInstructions: function (instructions: TInstructionNode[]) {
    state.memory.text = instructions;
    this.validate();

    instructions.forEach((instruction, index) => {
      try {
        const bitcode = instruction.assemble().bitcode;
        const deccode = parseInt(bitcode.join(""), 2);

        state.memory.wordView.set([deccode], index);
      }
      catch (e) { 
        console.warn(`skipping instruction: ${instruction.lineNumber} : ${instruction.text}`);
      }
    });

    state.currentInstruction = undefined;
    state.cpu.tick = 0;

    memory.observeMemory();

    // reset current tick to 0
    state.cpu.tick = 0;
    snapshots.takeSnapshot();
  },

  setHasNop: function (val: boolean) {
    state.memory.hasNop = val;
  },
  
	instruction: function (offset: number) : TInstructionNode {
    if (offset > state.memory.textHeight) {
      throw new RuntimeError(`SIGSEG: Segmentation fault.`, [], -1);
    }
    if (offset % 4 !== 0) {
      throw new RuntimeError("SIGBUS: Bus error - misaligned access.", [], -1);
    }

    return state.memory.text[offset / 4];
  },

  addLabel: function (label: string, address: number) {
    Vue.set(state.memory.textMap, label, address);
  },

	hasLabel: function (label: string) : boolean {
    return state.memory.textMap[label] !== undefined;
  },

  label: function (label: string) : number {
    return state.memory.textMap[label];
  },

	setCurrentInstruction: function (instruction: TInstructionNode) {
    state.currentInstruction = instruction;
  },

	setExecuted: function (executed: boolean) {
    state.wasExecuted = executed;
  },

  validate: function () {
    state.memory.text.forEach(ins => {
      if (ins instanceof LabelNode) {
        if (state.memory.textMap[ins.identifier] === undefined) {
          interaction.addError(new ReferenceError(`Missing reference to '${ins.identifier}'.`, ins.statement, ins.lineNumber, 1));
        }
      }
      else if (ins instanceof BranchNode) {
        if (typeof ins.Rd === 'string') {
          if (state.memory.textMap[ins.Rd] === undefined) {
            interaction.addError(new ReferenceError(`Missing reference to '${ins.Rd}'.`, ins.statement, ins.lineNumber, 1));
          }
        }
      }
      else if (ins instanceof SingleTransferNode && ins.isLiteral) {
        if (state.memory.dataTable[ins.literal] === undefined) {
          interaction.addError(new ReferenceError(`Missing reference to '${ins.literal}'.`, ins.statement, ins.lineNumber, 3));
        }
      }
    });
  },
}