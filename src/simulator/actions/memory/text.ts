import { RuntimeError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";

export const text = {
	
	instruction: function (offset: number) : TInstructionNode {
    if (offset > state.memory.textHeight) {
      throw new RuntimeError(`SIGSEG: Segmentation fault.`, [], -1);
    }
    if (offset % 4 !== 0) {
      throw new RuntimeError("SIGBUS: Bus error - misaligned access.", [], -1);
    }

    return state.memory.text[offset / 4];
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
  }
}