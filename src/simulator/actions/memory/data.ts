import { RuntimeError } from "@/interpreter";
import { state as state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";

export const data = {
  allocateData: function (heap: Uint8Array, height: number, map: Record<string, number>) {
    state.memory.byteView?.set(heap.slice(0, height), state.memory.textHeight);
    state.memory.dataHeight = height;

    for (const label in map) map[label] = map[label] + state.memory.textHeight;
    state.memory.dataMap = map;
  },

  dataLabel: function (label: string) : number {
    return state.memory.dataMap[label];
  }
}