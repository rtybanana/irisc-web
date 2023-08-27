import { Call, Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { RuntimeError } from "../error";
import { TInstructionNode } from "@/syntax/types";
import { printf } from './printf';
import { putchar } from "./putchar";
import { puts } from './puts';
import { malloc, free } from './allocation';

/**
 * Randomises the scratch registers to demonstrate that the contents of these
 * registers should not be assumed to stay the same after a function call.
 */
export function randomiseScratch() {
	let randomRange = 256
	SimulatorState.setRegister(Register.R0, Math.floor(Math.random() * randomRange));
	SimulatorState.setRegister(Register.R1, Math.floor(Math.random() * randomRange));
	SimulatorState.setRegister(Register.R2, Math.floor(Math.random() * randomRange));
	SimulatorState.setRegister(Register.R3, Math.floor(Math.random() * randomRange));
}

export function executeCall(instruction: TInstructionNode, call: Call) : boolean {

  // output
  if (call === Call.PUTCHAR) return putchar();
  if (call === Call.PUTS) return puts();
  if (call === Call.PRINTF) return printf();

  // allocation
  if (call === Call.MALLOC) return malloc();
  if (call === Call.FREE) return free();

  throw new RuntimeError("Attempted to branch to unrecognised function call. This is likely an error with iRISC. Please inform the developers.", instruction.statement, instruction.lineNumber)
}
