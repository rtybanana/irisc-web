import { RuntimeError } from "@/interpreter";
import { data } from "../data";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TSimulatorSnapshot } from "../types";

export const runtime = {
  instruction: function (offset: number) : TInstructionNode {
    if (offset > data.memory.textHeight) {
      throw new RuntimeError(`SIGSEG: Segmentation fault.`, [], -1);
    }
    if (offset % 4 !== 0) {
      throw new RuntimeError("SIGBUS: Bus error - misaligned access.", [], -1);
    }

    return data.memory.text[offset / 4];
  },
	
  addOutput(output: string) {
    [...output].forEach(char => {
      if (char === '\n') data.output.push("");
      else {
        let lastLine = data.output.length -1;
        let existingLine = data.output[lastLine];
        
        Vue.set(data.output, lastLine, `${existingLine}${char}`);
      }
    })
  },

	hasLabel: function (label: string) : boolean {
    return data.memory.textMap[label] !== undefined;
  },

  label: function (label: string) : number {
    return data.memory.textMap[label];
  },

	dataLabel: function (label: string) : number {
    return data.memory.dataMap[label];
  },

  store: function (toStore: number, address: number, size: TTransferSize) {
    console.log("storing", toStore, `(${size})`, "at address", address)
    if (size === "word") {
      data.memory.wordView[address / 4] = toStore;
    }
    else if (size === "byte") {
      data.memory.byteView[address] = toStore;
    }

    this.observeMemory();
  },

  observeMemory: function () {
    data.memory.observableByteView = Array.from(data.memory.byteView);
    data.memory.observableWordView = Array.from(data.memory.wordView);
  },

  setCurrentInstruction: function (instruction: TInstructionNode) {
    data.currentInstruction = instruction;
  },

	setExecuted: function (executed: boolean) {
    data.wasExecuted = executed;
  },

  setStackHeight: function (height: number) {
    data.memory.stackHeight = height;
  },

	getMemoryAccessRange: function (transfer: TransferNode, snapshot?: TSimulatorSnapshot) {
    if (!snapshot) {
      snapshot = data as TSimulatorSnapshot;
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