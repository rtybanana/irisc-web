import { Condition, Register } from "@/constants";
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

describe("MUL", () => {
	test("compilation | two operands", () => {
		let node = compile("muleq r0, r1");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R0);

		expect(node).toHaveProperty("_cond", Condition.EQ);
		expect(node).toHaveProperty("_setFlags", false);
	});

	test("compilation | three operands", () => {
		let node = compile("mulspl r0, r1, r2");

		expect(node).toHaveProperty("_Rd", Register.R0);
		expect(node).toHaveProperty("_Rn", Register.R1);
		expect(node).toHaveProperty("_Rm", Register.R2);

		expect(node).toHaveProperty("_cond", Condition.PL);
		expect(node).toHaveProperty("_setFlags", true);
	});
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