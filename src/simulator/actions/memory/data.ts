import { AssemblyError, RuntimeError } from "@/interpreter";
import { state as state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";
import { SimulatorState } from "@/simulator";

export const data = {
  allocateData: function (heap: Uint8Array, height: number, map: Record<string, number>) {
    state.memory.dataHeight = Math.ceil(height / 4) * 4;
    
    try {
      state.memory.byteView?.set(heap.slice(0, height), state.memory.textHeight);
    }
    catch (e) {
      SimulatorState.addError(new AssemblyError('Not enough memory to assemble program in editor.', [], -1, -1));
    }


    for (const label in map) map[label] = map[label] + state.memory.textHeight;
    state.memory.dataMap = map;
  },

  dataLabel: function (label: string) : number {
    return state.memory.dataMap[label];
  }
}