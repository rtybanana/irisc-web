import { Assembler, IriscError } from "@/interpreter";
import { state } from "../state";
import { SystemState, TExitStatus, TSimulatorSnapshot } from "../types";
import Vue from 'vue';
import { snapshots } from "./snapshots";
import { init } from "./init";
import { runner } from "./runner";
import { memory } from "./memory";
import { Queue } from "@/utilities";
import { AchievementState } from "@/achievements";

export const interaction = {
  start: function () {
    if (state.running) {
      if (!state.step) this.resume();
      return;
    }

    console.log("reinstating first snapshot");

    snapshots.reinstateSnapshot(0);
    state.paused = false;

    console.log("snapshot reinstated");
    
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
    if (state.cpu.tick > 0) AchievementState.achieve("Reverse, reverse!");

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
    if (delay === 10) AchievementState.achieve("CPU Upgrade")
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
  },

  crash: async function () {
    state.systemState = SystemState.CRASHING;
    await new Promise(r => setTimeout(r, 2000));

    state.systemState = SystemState.BLUESCREEN;
    await new Promise(r => setTimeout(r, 4000));

    state.systemState = SystemState.BIOS;
    await new Promise(r => setTimeout(r, 5000));

    AchievementState.achieve("BSoD");
    await new Promise(r => setTimeout(r, 3000));

    state.systemState = SystemState.BOOTING;
    await new Promise(r => setTimeout(r, 3000));

    state.systemState = SystemState.OK;
  }
}