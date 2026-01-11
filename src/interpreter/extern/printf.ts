import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { printf as cprintf, getTokens} from "@/assets/printf/printf";
import { RuntimeError } from "@/interpreter";
import { randomiseScratch } from ".";

export function printf(): boolean {
	const stringArr: string[] = [];

	// fetch full string from simulator memory
	let index = state.registers[Register.R0];
	while (state.memory.byteView[index] !== 0) {
		stringArr.push(String.fromCharCode(state.memory.byteView[index]));
		index++;
	}

	// join char array
	const formatStr = stringArr.join("");

	// get replaceable identifiers
	const tokens = getTokens(formatStr);

	let useStack = false;
	let currentRegister = Register.R1;
	let currentStackOffset = 0;
	const args = tokens.map((token, index) => {
		let data: any;
		let register: Register = currentRegister;
		let offset: number = currentStackOffset;         // byte view offset

		if (!useStack && currentRegister > Register.R3) useStack = true;

		// TODO: implement stack argument passing
		if (useStack) {
			const instruction = SimulatorState.currentInstruction()!;
			throw new RuntimeError("Passing arguments to printf via the stack is not yet supported. Coming soon!", instruction.statement, instruction.lineNumber);
		}

		if (token.specifier === 'c') {
			[data, register, offset] = getChar(useStack, currentRegister, currentStackOffset);
		}
		else if (token.specifier === 's') {
			[data, register, offset] = getString(useStack, currentRegister, currentStackOffset);
		}
		else if (['i', 'd'].includes(token.specifier)) {
			[data, register, offset] = getDecimal(useStack, currentRegister, currentStackOffset);
		}

		// TODO: implement other format specifiers
		else {
			const instruction = SimulatorState.currentInstruction()!;
			throw new RuntimeError("printf format strings with specifiers other than %c, %s, %d and %i are not yet supported.", instruction.statement, instruction.lineNumber);
		}

		currentRegister = register;
		currentStackOffset = offset;
		return data;
	});

	const string = cprintf(formatStr, ...args);
	SimulatorState.addOutput(string);

	randomiseScratch();
	SimulatorState.setRegister(Register.R0, string.length);

	return true;
}

function getChar(useStack: boolean, register: Register, offset: number): [string, Register, number] {
	let data: string;

	if (!useStack) {
		data = String.fromCharCode(state.registers[register]);
		register = (register + 1) as Register;
	}
	else {
		const framePointer = state.registers[Register.R11];
		data = String.fromCharCode(state.memory.byteView[framePointer + offset]);
		offset += 4;
	}

	return [data, register, offset];
}

function getString(useStack: boolean, register: Register, offset: number): [string, Register, number] {
	let address: number;

	if (!useStack) {
		address = state.registers[register];
		register = (register + 1) as Register;
	}
	else {
		const framePointer = state.registers[Register.R11];
		address = state.memory.byteView[framePointer + offset]
		offset += 4;
	}

	const stringArr: string[] = [];
	while (state.memory.byteView[address] !== 0) {
		stringArr.push(String.fromCharCode(state.memory.byteView[address]));
		address++;
	}

	const data = stringArr.join("");

	return [data, register, offset];
}

function getDecimal(useStack: boolean, register: Register, offset: number, signed: boolean = true): [number, Register, number] {
	let data: number;

	if (!useStack) {
		if (signed) data = -(~state.registers[register] + 1);		// invert and add one to get absolute signed value
		else data = state.registers[register];

		register = (register + 1) as Register;
	}
	else {
		const framePointer = state.registers[Register.R11];
		data = state.memory.wordView[(framePointer + offset) / 4];
		offset += 4;
	}

	return [data, register, offset];
}