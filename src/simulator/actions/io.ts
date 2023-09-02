import { state } from "../state";
import { TSimulatorSnapshot } from "../types";
import clone  from 'lodash.clonedeep';
import { memory } from "./memory";
import { runner } from "./runner";
import { interaction } from "./interaction";

export const io = {
  interrupt: async function () {
    state.stdin = undefined;
    state.interrupted = true;

    return await this.waitForIO();
  },

  setStdin: function (stdin: string) {
    state.stdin = stdin;
    interaction.addOutput(stdin);
    
    state.interrupted = false;
  },

  waitForIO: async function () {
    while (state.interrupted) {
      await new Promise(r => setTimeout(r, 100));
    }

    return;
  }
}