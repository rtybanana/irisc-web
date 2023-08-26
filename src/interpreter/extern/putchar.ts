import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { randomiseScratch } from ".";

export function putchar() : boolean {
  const charCode = state.registers[Register.R0];
  
  // add single char to output
  SimulatorState.addOutput(String.fromCharCode(charCode));

  randomiseScratch();
  SimulatorState.setRegister(Register.R0, charCode);

  return true;
}