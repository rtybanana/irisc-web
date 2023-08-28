import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { randomiseScratch } from ".";

export function malloc(): boolean {
	const size = state.registers[Register.R0];
	const ptr = SimulatorState.malloc(size);

	randomiseScratch();
	SimulatorState.setRegister(Register.R0, ptr);

	return true;
}

export function calloc(): boolean {
	const nmemb = state.registers[Register.R0];
	const size = state.registers[Register.R1];

	const ptr = SimulatorState.calloc(nmemb, size);

	randomiseScratch();
	SimulatorState.setRegister(Register.R0, ptr);

	return true;
}

export function free(): boolean {
	const ptr = state.registers[Register.R0]

	SimulatorState.free(ptr);

	randomiseScratch();

	return true;
}