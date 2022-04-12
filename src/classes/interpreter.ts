import { rotr } from "@/assets/bitset";
import { Operation, Register, Shift, Flag } from "@/constants";
import { BiOperandNode, FlexOperand, ShiftNode, TriOperandNode } from "./syntax";
import { TInstructionNode } from "./syntax/types";
import { EmulatorState } from "@/state";
import { RuntimeError } from "./error";
import { BranchNode } from "./syntax/BranchNode";

/**
 * Local declaration of useful EmulatorState getters with the js object getter
 * syntax so that they can be accessed like properties rather than requiring 
 * the function execution brackets (()).
 */
const state = {
  get registers() { return EmulatorState.registers() },
  get cpsr() { return EmulatorState.cpsr() }
}

/**
 * Wrapper for execution of all instruction-type nodes. The only function which is exported.
 * All other functions are private to this file and directly mutate the EmulatorState
 * 
 * @param instruction the instruction to be executed
 */
export function execute(instruction: TInstructionNode) : boolean {
  let executed: boolean = false;

  // EmulatorState.setRegister(Register.PC, state.registers[Register.PC] + 32);

  if (instruction instanceof BranchNode) {
    executed = executeBranch(instruction);

    // // only increment to the next instruction if branch didn't already (not executed)
    if (!executed) EmulatorState.setRegister(Register.PC, state.registers[Register.PC] + 32);
  }
  else {
    EmulatorState.setRegister(Register.PC, state.registers[Register.PC] + 32);

    if (instruction instanceof BiOperandNode) executed = executeBiOperand(instruction);
    if (instruction instanceof TriOperandNode) executed = executeTriOperand(instruction);
    if (instruction instanceof ShiftNode) executed = executeShift(instruction);
  }

  return executed;
}

/**
 * 
 * @param flex 
 * @returns 
 */
function deflex(flex: FlexOperand) : number {
  let deflex: number;

  let [Rm, shift, Rs, immShift] = flex.unpack();
  if (flex.isImm) return rotr(Rm as number, immShift);            // return value of immediate (short circuit)
  else deflex = state.registers[Rm as Register];               // get value in register

  if (flex.shifted) {
    let shiftBy: number;
    if (flex.shiftedByImm) shiftBy = Rs as number;                // get value of immediate shift
    else shiftBy = state.registers[Rs as Register];            // get value in shift register

    deflex = applyFlexShift(shift as Shift, deflex, shiftBy);     // apply the unpacked shift
  }
  
  return deflex;
}

/**
 * 
 * @param shift 
 * @param value 
 * @param amount 
 * @returns 
 */
function applyFlexShift(shift: Shift, value: number, amount: number) : number {
  switch(shift) {
    case Shift.LSL:
      return value << amount;
    case Shift.LSR:
      if (amount == 0) amount = 32;       // special case for right shifts
      return value >>> amount;
    case Shift.ROR:
      return rotr(value, amount);
    default:
      // TODO: get executing instruction from the EmulatorState and populate the error location params
      throw new RuntimeError("While attempting to perform a flex operand optional shift.", [], -1, -1);
  }
}

/**
 * 
 * @param instruction 
 * @returns 
 */
function executeBiOperand(instruction: BiOperandNode) : boolean {
  let [op, cond, set, dest, flex] = instruction.unpack();             // unpack the instruction
  if (!EmulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  let src: number = deflex(flex);                                     // deflex the flex operand into a single value
  switch(op) {                                                        // check opcode and execute instruction
    case Operation.MOV:
      if (set) EmulatorState.setFlags(state.registers[dest], src, src);
      EmulatorState.setRegister(dest, src);
      break;
    case Operation.MVN:
      if (set) EmulatorState.setFlags(state.registers[dest], -src, -src);
      EmulatorState.setRegister(dest, -src);
      break;
    case Operation.CMP:
      EmulatorState.setFlags(state.registers[dest], src, state.registers[dest] - src, '-');
      break;
    case Operation.CMN:
      EmulatorState.setFlags(state.registers[dest], src, state.registers[dest] + src, '+');
      break;
    case Operation.TST:
      EmulatorState.setFlags(state.registers[dest], src, state.registers[dest] & src);
      break;
    case Operation.TEQ:
      EmulatorState.setFlags(state.registers[dest], src, state.registers[dest] ^ src);
      break;
  }

  return true;
}

function executeTriOperand(instruction: TriOperandNode) : boolean {
  let [op, cond, set, dest, src, flex] = instruction.unpack();        // unpack the instruction
  if (!EmulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  let n = state.registers[src];
  let m = deflex(flex);                                               // deflex the flex operand into a value
  let result: number | undefined;
  switch (op) {                                                       // check opcode and execute instruction
    case Operation.AND:
      if (set) EmulatorState.setFlags(n, m, n & m);
      result = n & m;
      break;
    case Operation.EOR:
      if (set) EmulatorState.setFlags(n, m, n ^ m);
      result = n ^ m;
      break;
    case Operation.ORR:
      if (set) EmulatorState.setFlags(n, m, n | m);
      result = n | m;
      break;
    case Operation.ADD:
      if (set) EmulatorState.setFlags(n, m, n + m, '+');
      result = n + m;
      break;
    case Operation.SUB:
      if (set) EmulatorState.setFlags(n, m, n - m, '-');
      result = n - m;
      break;
    case Operation.RSB:
      if (set) EmulatorState.setFlags(m, n, m - n, '-');
      result = m - n;
      break;
    case Operation.BIC:
      if (set) EmulatorState.setFlags(m, n, n & (~m));
      result = n & (~m);
      break;
    case Operation.ADC:
      result = n + m + (state.cpsr[Flag.C] ? 1 : 0);
      if (set) EmulatorState.setFlags(n, m, n + m + (state.cpsr[Flag.C] ? 1 : 0), '+');
      break;
    case Operation.SBC:
      result = n - m - (state.cpsr[Flag.C] ? 0 : 1);
      if (set) EmulatorState.setFlags(n, m, n - m - (state.cpsr[Flag.C] ? 0 : 1), '-');
      break;
    case Operation.RSC:
      result = m - n - (state.cpsr[Flag.C] ? 0 : 1);
      if (set) EmulatorState.setFlags(n, m, m - n - (state.cpsr[Flag.C] ? 0 : 1), '-');
      break;
  } 

  if (result === undefined) {
    // TODO: get executing instruction from the EmulatorState and populate the error location params
    throw new RuntimeError("While attempting to perform a an instruction.", [], -1, -1);
  }

  EmulatorState.setRegister(dest, result);

  return true;
}

function executeShift(instruction: ShiftNode) : boolean {
  let [op, cond, set, dest, src1, src2] = instruction.unpack();       // unpack the instruction
  if (!EmulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  let n = state.registers[src1];
  let m;
  if (instruction.isReg) m = state.registers[src2 as Register];
  else m = src2 as number;

  let result;
  switch (op) {                                                        // check opcode and execute instruction
    case Shift.LSL:
      if (set) EmulatorState.setFlags(n, m, n << m);
      result = n << m;
      break;
    case Shift.LSR:
      if (set) EmulatorState.setFlags(n, m, n >> m);
      result = n >>> m;
      break;
    case Shift.ASR:
    case Shift.ROR:
      if (set) EmulatorState.setFlags(n, m, rotr(n, m));
      result = rotr(n, m);
      break;
    default:
      throw new RuntimeError("While attempting to perform a shift operation.", instruction.statement, instruction.lineNumber, 0);
  }

  EmulatorState.setRegister(dest, result);

  return true;
}

/**
 * 
 * @param instruction 
 * @returns 
 */
function executeBranch(instruction: BranchNode) : boolean {
  let [op, cond, to] = instruction.unpack();
  if (!EmulatorState.checkFlags(cond)) return false;                          // returns early if condition code is not satisfied

  let address: number;
  if (typeof to === 'string') address = EmulatorState.label(to as string);
  else address = state.registers[to as Register];
  
  switch (op) {
    case Operation.B:
    case Operation.BX:
      EmulatorState.setRegister(Register.PC, address);
      break;
    case Operation.BL:
      EmulatorState.setRegister(Register.LR, state.registers[Register.PC] + 32);
      EmulatorState.setRegister(Register.PC, address);
      break;
  }

  return true;
}