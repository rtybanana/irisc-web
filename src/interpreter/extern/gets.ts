import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { randomiseScratch } from ".";
import { RuntimeError } from "../error";

export async function gets() : Promise<boolean> {
  // block for IO
  await SimulatorState.interrupt();

  const ptr = state.registers[Register.R0];
  const stdin = SimulatorState.stdin()! + String.fromCharCode(0);

  // convert string to bytes and store
  const bytes = [...stdin].map((_, i) => stdin.charCodeAt(i));
  SimulatorState.storeBytes(bytes, ptr);

  randomiseScratch();
  SimulatorState.setRegister(Register.R0, ptr);

  return true;
}