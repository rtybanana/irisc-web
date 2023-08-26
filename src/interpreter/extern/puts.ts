import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { randomiseScratch } from ".";

export function puts() : boolean {
  let stringArr: string[] = [];

  // fetch full string from simulator memory
  let index = state.registers[Register.R0];
  while (state.memory.byteView[index] !== 0) {
    stringArr.push(String.fromCharCode(state.memory.byteView[index]));
    index++;
  }

  // join char array
  let string = stringArr.join("");

  // append newline character and add to output
  SimulatorState.addOutput(`${string}\n`);

  // randomise scratch registers and set return
  randomiseScratch();
  SimulatorState.setRegister(Register.R0, 1);

  return true;
}