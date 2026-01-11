import { IriscError } from "@/interpreter";
import { state } from "../state";
import { TExitStatus, TSimulatorSnapshot } from "../types";
import Vue from 'vue';
import { snapshots } from "./snapshots";
import { init } from "./init";
import { runner } from "./runner";
import { memory } from "./memory";
import { Queue } from "@/utilities";

export const interaction = {
  start: function () {
    if (state.running) {
      if (!state.step) this.resume();
      return;
    }

    snapshots.reinstateSnapshot(0);
    state.paused = false;
    
    // reset emulator state and run simulation
    init.reset();
    runner.run();
  },

  stepForward: function () {
    if (state.running && state.paused) {
      this.setStep(true);
      return
    }
    
    this.pause();
    if (!state.running) {
      init.reset();
      runner.run();
    }
  },

  stepBack: function () {
    snapshots.reinstateSnapshot(state.cpu.tick - 1);
  },

  pause: function () {
    state.paused = true;
  },

  resume: function () {
    state.paused = false;
  },

  setStep: function (value: boolean) {
    state.step = value;
  },

  stop: function () {
    state.interrupted = false;
    state.running = false;
    state.paused = false;
  },

  setDelay(delay: number) : void {
    state.delay = delay;
  },

	addError(error: IriscError) {
    state.errors.push(error);
  },

  hoverError(error: IriscError) {
    state.hoveredError = error;
  },

  unhoverError() {
    state.hoveredError = null;
  },

	toggleBreakpoint: function (lineNumber: number) {
    const instruction = state.memory.text.find(e => e.lineNumber === lineNumber);

    if (instruction) {
      const breakpoint = state.breakpoints.find(e => e.lineNumber === instruction?.lineNumber);
      if (breakpoint) {
        state.breakpoints = state.breakpoints.filter(e => e.lineNumber !== breakpoint?.lineNumber)
      }
      else {
        state.breakpoints.push(instruction);
      }
    }
  },

  removeBreakpoints: function () {
    state.breakpoints = [];
  },

  addOutput(output: string) {
    [...output].forEach(char => {
      if (char === '\n') state.output.push("");
      else {
        const lastLine = state.output.length -1;
        const existingLine = state.output[lastLine];
        
        Vue.set(state.output, lastLine, `${existingLine}${char}`);
      }
    })
  },

	// on simulation finish
  setExitStatus: function (status: TExitStatus) {
    state.exitStatus = status;
    this.stop();
  }
}