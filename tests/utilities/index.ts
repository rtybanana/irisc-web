import { SimulatorState } from "@/simulator";
import { Assembler } from "@/interpreter";
import { InstructionNode } from "@/syntax";

export const state = {
	get registers() { return SimulatorState.registers(); },
	get cpsr() { return SimulatorState.cpsr(); },
	get memory() { return SimulatorState.memory(); },
	get previousPC() { return SimulatorState.previousPC(); },
	get breakpoints() { return SimulatorState.breakpoints(); }
}

export const compileOne = (instruction: string) : InstructionNode => {
	const parsed = Assembler.parse(instruction);
	return Assembler.compileOne(parsed[0], 1) as InstructionNode;
}