import { IriscError } from "@/interpreter";
import { data } from "../data";
import { TExitStatus } from "../types";

export const interaction = {
  start: function () {
    data.running = true;
  },

  pause: function () {
    data.paused = true;
  },

  resume: function () {
    data.paused = false;
  },

  setStep: function (value: boolean) {
    data.step = value;
  },

  stop: function () {
    data.running = false;
    data.paused = false;
  },

  setDelay(delay: number) : void {
    data.delay = delay;
  },

	addError(error: IriscError) {
    data.errors.push(error);
  },

  hoverError(error: IriscError) {
    data.hoveredError = error;
  },

  unhoverError() {
    data.hoveredError = null;
  },

	toggleBreakpoint: function (lineNumber: number) {
    console.log(lineNumber);
    
    console.log(data.memory.text);
    let instruction = data.memory.text.find(e => e.lineNumber === lineNumber);
    console.log(instruction);

    if (instruction) {
      let breakpoint = data.breakpoints.find(e => e.lineNumber === instruction?.lineNumber);
      if (breakpoint) {
        data.breakpoints = data.breakpoints.filter(e => e.lineNumber !== breakpoint?.lineNumber)
      }
      else {
        data.breakpoints.push(instruction);
      }
    }
  },

  removeBreakpoints: function () {
    data.breakpoints = [];
  },

	// on simulation finish
  setExitStatus: function (status: TExitStatus) {
    data.exitStatus = status;
    this.stop();
  }
}