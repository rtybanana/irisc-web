import { Register } from "@/constants";
import { Interpreter } from "@/interpreter";
import { compileOne, state } from "tests/utilities";

describe("MUL (tri-operand)", () => {
    let cases = [
        [2, 2, 4],
        [-3, -3, 9],
        [-1, 145034, (-145034 >>> 0)],		// >>> (lsr) 0 to make unsigned
        [15, 10, 150],
        [0xffffffff, 0xffffffff, 1],
        [0x40000010, 0x40000010, 0x100]
    ];

    let instruction = compileOne("mul r0, r1, r2");
    test.each(cases)(
        "execution | %p * %p = %p",
        async (Rn, Rm, Rd) => {
            state.registers[Register.R1] = Rn;
            state.registers[Register.R2] = Rm;

            await Interpreter.execute(instruction);
            expect(state.registers[Register.R0]).toBe(Rd);
        }
    );
});

describe("MUL (bi-operand)", () => {
    let cases = [
        [2, 2, 4],
        [-3, -3, 9],
        [-1, 145034, (-145034 >>> 0)],		// >>> (lsr) 0 to make unsigned
        [15, 10, 150],
        [0xffffffff, 0xffffffff, 1],
        [0x40000010, 0x40000010, 0x100]
    ];

    let instruction = compileOne("mul r0, r1");
    test.each(cases)(
        "execution | %p * %p = %p",
        async (Rn, Rm, Rd) => {
            state.registers[Register.R0] = Rn;
            state.registers[Register.R1] = Rm;

            await Interpreter.execute(instruction);
            expect(state.registers[Register.R0]).toBe(Rd);
        }
    );
});

describe("MLA", () => {
    // these cases are the same multiplications from the MUL tests with an Ra equal to the negated result
    // all final results should be zero
    let cases = [
        [-4, 2, 2, 0],
        [-9, -3, -3, 0],
        [145034, -1, 145034, 0],		// >>> (lsr) 0 to make unsigned
        [-150, 15, 10, 0],
        [-1, 0xffffffff, 0xffffffff, 0],
        [-0x100, 0x40000010, 0x40000010, 0]
    ];

    let instruction = compileOne("mla r0, r1, r2, r3");
    test.each(cases)(
        "execution | %p + (%p * %p) = %p",
        async (Ra, Rn, Rm, Rd) => {
            state.registers[Register.R1] = Rn;
            state.registers[Register.R2] = Rm;
            state.registers[Register.R3] = Ra;

            await Interpreter.execute(instruction);
            expect(state.registers[Register.R0]).toBe(Rd);
        }
    );
});

describe("MLS", () => {
    // these cases are the same multiplications from the MUL tests with an Ra equal to the result
    // all final results should be zero
    let cases = [
        [4, 2, 2, 0],
        [9, -3, -3, 0],
        [-145034, -1, 145034, 0],
        [150, 15, 10, 0],
        [1, 0xffffffff, 0xffffffff, 0],
        [0x100, 0x40000010, 0x40000010, 0]
    ];

    let instruction = compileOne("mls r0, r1, r2, r3");
    test.each(cases)(
        "execution | %p - (%p * %p) = %p",
        async (Ra, Rn, Rm, Rd) => {
            state.registers[Register.R1] = Rn;
            state.registers[Register.R2] = Rm;
            state.registers[Register.R3] = Ra;

            await Interpreter.execute(instruction);
            expect(state.registers[Register.R0]).toBe(Rd);
        }
    );
});