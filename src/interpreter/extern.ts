import { Call, dataTypeMap, Register } from "@/constants";
import { SimulatorState } from "@/state";
import { TInstructionNode } from "@/syntax/types";
import { RuntimeError } from "./error";
import { state } from "./interpreter";
import { printf as cprintf, getTokens} from "@/assets/printf";

export function executeCall(instruction : TInstructionNode, call: Call) : boolean {
  if (call === Call.PUTCHAR) return putchar();
  if (call === Call.PUTS) return puts();
  if (call === Call.PRINTF) return printf();

  throw new RuntimeError("Attempted to branch to unrecognised function call. This is likely an error with iRISC. Please inform the developers.", instruction.statement, instruction.lineNumber)
}

/**
 * Randomises the scratch registers to demonstrate that the contents of these
 * registers should not be assumed to stay the same after a function call.
 */
function randomiseScratch() {
  const randomRange = 256
  SimulatorState.setRegister(Register.R0, Math.floor(Math.random() * randomRange));
  SimulatorState.setRegister(Register.R1, Math.floor(Math.random() * randomRange));
  SimulatorState.setRegister(Register.R2, Math.floor(Math.random() * randomRange));
  SimulatorState.setRegister(Register.R3, Math.floor(Math.random() * randomRange));
}

function putchar() : boolean {
  const charCode = state.registers[Register.R0];
  
  // add single char to output
  SimulatorState.addOutput(String.fromCharCode(charCode));

  randomiseScratch();
  SimulatorState.setRegister(Register.R0, charCode);

  return true;
}

function puts() : boolean {
  const stringArr: string[] = [];

  // fetch full string from simulator memory
  let index = state.registers[Register.R0];
  while (state.memory.byteView[index] !== 0) {
    stringArr.push(String.fromCharCode(state.memory.byteView[index]));
    index++;
  }

  // join char array
  const string = stringArr.join("");

  // append newline character and add to output
  SimulatorState.addOutput(`${string}\n`);

  // randomise scratch registers and set return
  randomiseScratch();
  SimulatorState.setRegister(Register.R0, 1);

  return true;
}

function printf() : boolean {
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
  let currentOffset = 0;
  const args = tokens.map((token, index) => {
    let data: any;
    let register: Register = currentRegister;
    let offset: number = currentOffset;         // byte view offset

    if (!useStack && currentRegister > Register.R3) useStack = true;

    // TODO: implement stack argument passing
    if (useStack) {
      const instruction = SimulatorState.currentInstruction()!;
      throw new RuntimeError("Passing arguments to printf via the stack is not yet supported. Coming soon!", instruction.statement, instruction.lineNumber);
    }

    if (token.specifier === 'c') {
      [data, register, offset] = getChar(useStack, currentRegister, currentOffset);
    }
    else if (token.specifier === 's') {
      [data, register, offset] = getString(useStack, currentRegister, currentOffset);
    }
    else if (['i', 'd'].includes(token.specifier)) {
      [data, register, offset] = getDecimal(useStack, currentRegister, currentOffset);
    }

    // TODO: implement other format specifiers
    else {
      const instruction = SimulatorState.currentInstruction()!;
      throw new RuntimeError("printf format strings with specifiers other than %c, %s, %d and %i are not yet supported.", instruction.statement, instruction.lineNumber);
    }

    currentRegister = register;
    currentOffset = offset;
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

  return [ data, register, offset ];
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

  return [ data, register, offset ];
}

function getDecimal(useStack: boolean, register: Register, offset: number): [number, Register, number] {
  let data: number;

  if (!useStack) {
    data = state.registers[register];
    register = (register + 1) as Register;
  }
  else {
    const framePointer = state.registers[Register.R11];
    data = state.memory.wordView[(framePointer + offset) / 4];
    offset += 4;
  }

  return [ data, register, offset ];
}
