import { Register } from "@/constants";
import { RuntimeError, Interpreter } from "@/interpreter";
import { TInstructionNode } from "@/syntax/types";
import { state } from "../state";
import { init } from "./init";
import { memory } from "./memory";
import { interaction } from "./interaction";
import { cpu } from "./cpu";
import { snapshots } from "./snapshots";

export const runner = {
  /**
   * 
   */
  run: async function (skipToSleep?: boolean) {
    if (!skipToSleep) {
      init.setEntryPoint();
      memory.setStackHeight(0);
    }

    state.running = true;
    try {
      while(state.running) {
        if (!skipToSleep) {
          interaction.setStep(false);
          let node: TInstructionNode = memory.instruction(state.cpu.registers[Register.PC]);

          // if runtime instruction runoff
          if (node === undefined) {
            let last: TInstructionNode = state.currentInstruction!;
            throw new RuntimeError("SIGSEG: Segmentation fault.", last.statement, last.lineNumber);
          }

          Interpreter.execute(node);
        }

        // check for bx lr to static exit point (one word after memory.size)
        if (state.cpu.registers[Register.PC] === state.memory.size + 4) {
          interaction.setExitStatus(0);
        }
        else {
          // check for breakpoint
          const nextInstruction: TInstructionNode = memory.instruction(state.cpu.registers[Register.PC]);
          if (state.breakpoints.find(e => e.lineNumber === nextInstruction.lineNumber)) {
            interaction.pause();
          }
        }

        skipToSleep = false;
        await this.sleep();
      }
    }
    catch (e) {
      console.error(e);

      if (e instanceof RuntimeError) {
        interaction.setExitStatus(e);
      }
    }
  },

  /**
   * Checks every 50ms to see if tick speed (delay) value has changed. If the delay has elapsed
   * then move return so that the simulator may continue to the next instruction.
   */
  sleep: async function () {
    let sleptfor: number = 0;
    while ((sleptfor < state.delay || state.paused) && state.running && !state.step) {
      await new Promise(r => setTimeout(r, 10));
      sleptfor += 10;
    }

    return;
  },
}