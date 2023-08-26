import { RuntimeError } from "@/interpreter";
import { state as state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";

export const data = {
	dataLabel: function (label: string) : number {
    return state.memory.dataMap[label];
  },
}