import { AssemblyError, RuntimeError } from "@/interpreter";
import { state as state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TAllocation, TDeclaration, TSimulatorSnapshot } from "../../types";
import { SimulatorState } from "@/simulator";

export const data = {
  allocateData: function (declarations: TDeclaration[], height: number) {
    const data = new Uint8Array(new ArrayBuffer(state.memory.size)); 
    const table: Record<string, number> = {};
    const map = new Map<number, TDeclaration>();

    declarations.forEach(e => {
      data.set(e.data, e.offset);

      const address = state.memory.textHeight + e.offset;
      table[e.label] = address; 
      map.set(address, e);
    });

    try {
      state.memory.byteView?.set(data.slice(0, height), state.memory.textHeight);
    }
    catch (e) {
      SimulatorState.addError(new AssemblyError('Not enough memory to assemble program in editor.', [], -1, -1));
    }

    state.memory.dataHeight = Math.ceil(height / 4) * 4;
    state.memory.dataTable = table;
    state.memory.dataMap = map;
  },

  dataLabel: function (label: string) : number {
    return state.memory.dataTable[label];
  }
}