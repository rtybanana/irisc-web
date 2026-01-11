import { Register } from "@/constants";
import { Assembler, Interpreter } from "@/interpreter"
import { SimulatorState } from "@/simulator";
import { InstructionNode, MulNode } from "@/syntax";

const compile = (program: string) => {
  let parsed = Assembler.parse(program);
	return Assembler.compileOne(parsed[0], 1);
}

const state = {
	get registers() { return SimulatorState.registers(); }
}

beforeEach(() => SimulatorState.reset())

describe("MUL", () => {
	test("compilation | two operands", () => {
		let node = compile("mul r0, r1");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R0);
	});

	test("compilation | three operands", () => {
		let node = compile("mul r0, r1, r2");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R2);
	});

	let instruction = compile("mul r0, r1, r2") as InstructionNode;
	let cases = [
		[2, 2, 4],
		[-3, -3, 9],
		[-1, 145034, (-145034 >>> 0)],		// >>> (lsr) 0 to make unsigned
		[15, 10, 150],
		[0xffffffff, 0xffffffff, 1],
		[0x40000010, 0x40000010, 0x100]
	];

	test.each(cases)(
		"execution | %p * %p = %p",
		async (Rn, Rm, Rd) => {
			state.registers[Register.R1] = Rn;
			state.registers[Register.R2] = Rm;

			await Interpreter.execute(instruction);
			expect(state.registers[Register.R0]).toBe(Rd);
		}
	)
});

describe("MLA", () => {
	test("compilation", () => {
		let node = compile("mla r0, r1, r2, r3");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R2);
		expect(node).toHaveProperty("_Ra", Register.R3);
	});
});

describe("MLS", () => {
	test("compilation", () => {
		let node = compile("mls r0, r1, r2, r3");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R2);
		expect(node).toHaveProperty("_Ra", Register.R3);
	});
});