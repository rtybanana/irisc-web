/**
 * The tests in this file check if immediate strings are parsed correctly into base number 
 * and shift pairs for the flex operand. The shift must be an even right rotation between 0 
 * and 30 and the base number has a max value of 255. There are some additional rules to 
 * make sure that the expected result is consistent and logical:
 * 
 *    - If there are multiple correct representations for the tested outcome,
 *      then the option which requires the greatest base number should be 
 *      considered correct.
 * 
 *    - If the immediate cannot be represented in the way described, then a 
 *      NumericalError is thrown with an appropriate message. Tests should 
 *      check that the accompanying message is correct.
 */

import { SyntaxNode } from "@/syntax";
import { Assembler, NumericalError } from "@/interpreter"
import '@/assets/prism-armv7';

const node = new SyntaxNode([], 0, 0);
const assemble = (imm: string, bits: number = 8) => {
  const token = Assembler.parse(imm);
  return node.parseShiftedImm(token[0][0], bits);
}

/**
 * These tests check the most simple set of immediate assemblies, where no barrel-shift
 * is required and the base number sits neatly within the 8-bit max width.
 */
describe("assembling immediates, simple", () => {
  test("valid", () => {
    expect(assemble("#0")).toStrictEqual([0, 0]);
    expect(assemble("#0b1")).toStrictEqual([1, 0]);
    expect(assemble("#0100")).toStrictEqual([64, 0]);
    expect(assemble("#0xff")).toStrictEqual([255, 0]);
    expect(assemble("#0x64")).toStrictEqual([100, 0]);
  });

  test("invalid, too wide", () => {
    expect(() => assemble("#0xfff")).toThrow("maximum set-bit width");
    expect(() => assemble("#0x101")).toThrow("maximum set-bit width");
    expect(() => assemble("#0x700d")).toThrow("maximum set-bit width");
  });

  test("invalid, way too wide", () => {
    expect(() => assemble("#0xfffffffff")).toThrow("represented in 32 bits");
    expect(() => assemble("#0x100000000000")).toThrow("represented in 32 bits");
    expect(() => assemble("#0x1239faedc810b")).toThrow("represented in 32 bits");
  });
});

/**
 * These tests check more complicated immediate assemblies where a barrel-shift is 
 * reverse-engineered from the desired final value.
 */
describe("assembling immediates, barrel shift", () => {
  test("valid", () => {
    expect(assemble("#0xff0")).toStrictEqual([255, 28]);
    expect(assemble("#0x7e000")).toStrictEqual([126, 20]);
    expect(assemble("#0x11000000")).toStrictEqual([68, 10]);
    expect(assemble("#0x0100000")).toStrictEqual([64, 18]);
  });
});

/**
 * These tests are to check a confusing edge case where numbers occupying bit-space
 * at opposite ends of the word can still be valid, so long as their rotated bit-width
 * is no greater than eight.
 */
describe("assembling immediates, rolled corner edge case", () => {
  test("valid", () => {
    expect(assemble("#0xf000000f")).toStrictEqual([255, 4]);
    expect(assemble("#0x40000010")).toStrictEqual([130, 2]);
  });

  test("invalid, too wide", () => {
    // this needs to be wrapped in an anonymous function so that jest can catch the error ??
    // https://stackoverflow.com/questions/46042613/how-to-test-the-type-of-a-thrown-exception-in-jest
    expect(() => assemble("#0xf0000010")).toThrow("maximum set-bit width");
  });

  test("invalid, odd rotation", () => {
    expect(() => assemble("#0x80000040")).toThrow("even number of bits");
  })
});

