import { Call, Register } from "@/constants";
import { SimulatorState } from "@/state";
import { TInstructionNode } from "@/syntax/types";
import { RuntimeError } from "./error";
import { state } from "./interpreter";

export function executeCall(instruction : TInstructionNode, call: Call) : boolean {
  if (call === Call.PUTCHAR) return putchar();
  if (call === Call.PUTS) return puts();
  if (call === Call.PRINTF) return printf();

  throw new RuntimeError("Attempted to branch to unrecognised function call. This is likely an error with iRISC. Please inform the developers.", instruction.statement, instruction.lineNumber)
}

function putchar() : boolean {
  SimulatorState.addOutput(String.fromCharCode(state.registers[Register.R0]));
  return true;
}

function puts() : boolean {
  return false;
}

function printf() : boolean {
  return false;
}
