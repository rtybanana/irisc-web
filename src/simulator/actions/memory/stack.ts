import { RuntimeError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";

export const stack = {
	setStackHeight: function (height: number) {
    state.memory.stackHeight = height;
  }
}