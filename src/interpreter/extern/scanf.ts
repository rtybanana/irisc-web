import { Register } from "@/constants";
import { SimulatorState } from "@/simulator";
import { state } from "@/interpreter/interpreter";
import { randomiseScratch } from ".";
import { RuntimeError } from "../error";
import { sscanf } from  '@/assets/scanf';

export async function scanf() : Promise<boolean> {
  // block for IO
  await SimulatorState.interrupt();
  const stdin = SimulatorState.stdin();

	if (stdin === undefined) {
		SimulatorState.setRegister(Register.R0, -1);
		return true;
	}

  const stringArr: string[] = [];

	// fetch full string from simulator memory
	let index = state.registers[Register.R0];
	while (state.memory.byteView[index] !== 0) {
		stringArr.push(String.fromCharCode(state.memory.byteView[index]));
		index++;
	}

	// join char array
	const formatStr = stringArr.join("");
	const tokens = sscanf(stdin, formatStr);

	if (tokens.every((e: string | number) => e == null || Number.isNaN(e))) {
		// no tokens found
		SimulatorState.setRegister(Register.R0, -1);
		return true;
	}

  let useStack = false;
	let currentRegister = Register.R1;
	let currentStackOffset = 0;
	tokens.forEach((token: string | number) => {
		const ptr = state.registers[currentRegister];
		const offset: number = currentStackOffset;         // byte view offset

		if (!useStack && currentRegister > Register.R3) useStack = true;

		// TODO: implement stack argument passing
		if (useStack) {
			const instruction = SimulatorState.currentInstruction()!;
			throw new RuntimeError("Passing arguments to printf via the stack is not yet supported. Coming soon!", instruction.statement, instruction.lineNumber);
		}

		if (typeof token === 'number') {
			if (!Number.isInteger(token)) {
				const instruction = SimulatorState.currentInstruction()!;
				throw new RuntimeError("Floats and doubles are not yet supported by iRISC. Maybe someday eh?", instruction.statement, instruction.lineNumber);
			}

			SimulatorState.store(token, ptr, "word");
		}
		else if (typeof token === 'string') {
			if (token.length > 1) {
				const bytes = [...token].map((_, i) => token.charCodeAt(i));
				SimulatorState.storeBytes(bytes, ptr);
			}
			else {
				SimulatorState.store(token.charCodeAt(0), ptr, "byte");
			}
		}

		currentRegister = (currentRegister + 1) as Register;
		currentStackOffset = offset;
	});



  return true;
}