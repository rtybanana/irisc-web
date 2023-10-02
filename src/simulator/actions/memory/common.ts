import { RuntimeError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";
import { TByteRange } from "@/explainer/types";

export const common = {
  align(size: number): number {
    return Math.ceil(size / 8) * 8;
  },

	store: function (toStore: number, address: number, size: TTransferSize) {
    if (size === "word") {
      const buffer = new ArrayBuffer(4);
      const word = new Uint32Array(buffer);
      const bytes = new Uint8Array(buffer);
      word.set([toStore], 0);

      state.memory.byteView.set(bytes, address);
      // state.memory.wordView[address / 4] = toStore;
    }
    else if (size === "byte") {
      state.memory.byteView[address] = toStore;
    }

    this.observeMemory();
  },

  storeBytes: function (toStore: number[], ptr: number) {
    if (ptr + toStore.length > state.memory.size - state.memory.stackHeight) {
      throw new RuntimeError("SIGSEG: Segmentation fault.", state.currentInstruction!.statement, state.currentInstruction!.lineNumber);
    }

    state.memory.byteView.set(toStore, ptr);
    this.observeMemory();
  },

  observeMemory: function () {
    state.memory.observableByteView = Array.from(state.memory.byteView);
    state.memory.observableWordView = Array.from(state.memory.wordView);
  },

	getMemoryAccessRange: function (transfer: TransferNode, snapshot?: TSimulatorSnapshot): TByteRange | undefined {
    if (!snapshot) {
      snapshot = { ...state, key: 0 } as TSimulatorSnapshot;
    }

    if (transfer instanceof BlockTransferNode) {
      let [op, cond, base, reglist, mode, wb] = transfer.unpack();

      const address = snapshot.cpu.registers[base as Register];
      const isIncrement = addressModeGroup.increment.includes(mode);
      const nRegisters = reglist.length;

      if (isIncrement) {
        return {
          base: address,
          limit: address + (nRegisters * 4) - 1
        }
      }
      else {
        return {
          base: address - (nRegisters * 4)  + 1,
          limit: address
        }
      }
    }
    else if (transfer instanceof SingleTransferNode) {
      const [op, cond, size, reg, addr, sign, flex, mode, wb] = transfer.unpack();
      let address: number;

      if (typeof addr === "string") {
        address = snapshot.memory.dataTable[addr];
      }
      else {
        address = snapshot.cpu.registers[addr as Register];
      }

      if (size === "word") {
        if (sign === '+') {
          return {
            base: address,
            limit: address + 3
          }
        }
        else {
          return {
            base: address - 3,
            limit: address
          }
        }
      }
      else if (size === "byte") {
        if (sign === '+') {
          return {
            base: address,
            limit: address
          }
        }
        else {
          return {
            base: address - 1,
            limit: address
          }
        }
      }
    }
  }
}