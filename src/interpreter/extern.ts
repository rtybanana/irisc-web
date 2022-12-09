import { Call, dataTypeMap, Register } from "@/constants";
import { SimulatorState } from "@/state";
import { TInstructionNode } from "@/syntax/types";
import { RuntimeError } from "./error";
import { state } from "./interpreter";
import { default as cprintf } from "printf";

export function executeCall(instruction : TInstructionNode, call: Call) : boolean {
  if (call === Call.PUTCHAR) return putchar();
  if (call === Call.PUTS) return puts();
  if (call === Call.PRINTF) return printf();

  throw new RuntimeError("Attempted to branch to unrecognised function call. This is likely an error with iRISC. Please inform the developers.", instruction.statement, instruction.lineNumber)
}

function putchar() : boolean {
  // add single char to output
  SimulatorState.addOutput(String.fromCharCode(state.registers[Register.R0]));
  return true;
}

function puts() : boolean {
  let stringArr: string[] = [];

  // fetch full string from simulator memory
  let index = state.registers[Register.R0];
  while (state.memory.byteView[index] !== 0) {
    stringArr.push(String.fromCharCode(state.memory.byteView[index]));
    index++;
  }

  // join char array
  let string = stringArr.join("");

  // add to output and set return value
  SimulatorState.addOutput(string);
  SimulatorState.setRegister(Register.R0, 1);

  return true;
}

function printf() : boolean {
  return false;
}
