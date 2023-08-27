import { RuntimeError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../../types";

export const common = {
	store: function (toStore: number, address: number, size: TTransferSize) {
    if (size === "word") {
      state.memory.wordView[address / 4] = toStore;
    }
    else if (size === "byte") {
      state.memory.byteView[address] = toStore;
    }

    this.observeMemory();
  },

  observeMemory: function () {
    state.memory.observableByteView = Array.from(state.memory.byteView);
    state.memory.observableWordView = Array.from(state.memory.wordView);
  },

	getMemoryAccessRange: function (transfer: TransferNode, snapshot?: TSimulatorSnapshot) {
    if (!snapshot) {
      snapshot = state as TSimulatorSnapshot;
    }

    if (transfer instanceof BlockTransferNode) {
      let [op, cond, base, reglist, mode, wb] = transfer.unpack();

      const address = snapshot.cpu.registers[base as Register];
      const isIncrement = addressModeGroup.increment.includes(mode);
      const nRegisters = reglist.length;

      if (isIncrement) {
        return {
          base: address,
          limit: address + (nRegisters * 4)
        }
      }
      else {
        return {
          base: address - (nRegisters * 4),
          limit: address
        }
      }
    }
    else if (transfer instanceof SingleTransferNode) {
      const [op, cond, size, reg, addr, sign, flex, mode, wb] = transfer.unpack();
      let address: number;

      if (typeof addr === "string") {
        address = snapshot.memory.dataMap[addr];
      }
      else {
        address = snapshot.cpu.registers[addr as Register];
      }

      if (size === "word") {
        if (sign === '+') {
          return {
            base: address,
            limit: address + 4
          }
        }
        else {
          return {
            base: address - 4,
            limit: address
          }
        }
      }
      else if (size === "byte") {
        if (sign === '+') {
          return {
            base: address,
            limit: address + 1
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