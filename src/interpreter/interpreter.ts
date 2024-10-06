import { rotr } from "@/assets/bitset";
import { addressModeGroup, BlockTransfer, callAddress, callMap, Flag, Operation, opTitle, Register, Shift, SingleTransfer, TTransferSize } from "@/constants";
import { SimulatorState } from "@/simulator";
import { BiOperandNode, FlexOperand, ShiftNode, TriOperandNode, BranchNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TInstructionNode } from "@/syntax/types";
import { ReferenceError, RuntimeError } from "./error";
import { executeCall } from "./extern";

/**
 * Local declaration of useful EmulatorState getters with the js object getter
 * syntax so that they can be accessed like properties rather than requiring 
 * the function execution brackets (()).
 */
const state = {
  get registers() { return SimulatorState.registers(); },
  get cpsr() { return SimulatorState.cpsr(); },
  get memory() { return SimulatorState.memory(); },
  get previousPC() { return SimulatorState.previousPC(); },
  get breakpoints() { return SimulatorState.breakpoints(); }
}

/**
 * Wrapper for execution of all instruction-type nodes. The only function which is exported.
 * All other functions are private to this file and directly mutate the EmulatorState
 * 
 * @param instruction the instruction to be executed
 */
export async function execute(instruction: TInstructionNode, incPC: boolean = true) : Promise<boolean> {
  let executed: boolean = false;
  SimulatorState.setCurrentInstruction(instruction);

  {
    if (instruction instanceof BranchNode) executed = await executeBranch(instruction);

    if (instruction instanceof BiOperandNode) executed = executeBiOperand(instruction);
    if (instruction instanceof TriOperandNode) executed = executeTriOperand(instruction);
    if (instruction instanceof ShiftNode) executed = executeShift(instruction);

    if (instruction instanceof SingleTransferNode) executed = executeSingleTransfer(instruction);
    if (instruction instanceof BlockTransferNode) executed = executeBlockTransfer(instruction);
  }

  SimulatorState.tick();
  SimulatorState.setExecuted(executed);
  SimulatorState.takeSnapshot();

  return executed;
}

/**
 * 
 * @param flex 
 * @returns 
 */
export function deflex(flex: FlexOperand) : number {
  let deflex: number;

  const [Rm, shift, Rs, immShift] = flex.unpack();
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
    case Shift.ASR:
      return value >> amount;
    case Shift.ROR:
      return rotr(value, amount);
    default:
      let instruction = state.memory.text[state.registers[Register.PC]];
      throw new RuntimeError("While attempting to perform a flex operand optional shift.", instruction.statement, instruction.lineNumber);
  }
}

/**
 * 
 * @param instruction 
 * @returns 
 */
function executeBiOperand(instruction: BiOperandNode) : boolean {
  const [op, cond, set, dest, flex] = instruction.unpack();             // unpack the instruction
  if (!SimulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  const src: number = deflex(flex);                                     // deflex the flex operand into a single value
  switch(op) {                                                        // check opcode and execute instruction
    case Operation.MOV:
      if (set) SimulatorState.setFlags(state.registers[dest], src, src);
      SimulatorState.setRegister(dest, src);
      break;
    case Operation.MVN:
      if (set) SimulatorState.setFlags(state.registers[dest], -src, -src);
      SimulatorState.setRegister(dest, -src);
      break;
    case Operation.CMP:
      SimulatorState.setFlags(state.registers[dest], src, state.registers[dest] - src, '-');
      break;
    case Operation.CMN:
      SimulatorState.setFlags(state.registers[dest], src, state.registers[dest] + src, '+');
      break;
    case Operation.TST:
      SimulatorState.setFlags(state.registers[dest], src, state.registers[dest] & src);
      break;
    case Operation.TEQ:
      SimulatorState.setFlags(state.registers[dest], src, state.registers[dest] ^ src);
      break;
  }

  return true;
}

/**
 * 
 * @param instruction 
 * @returns 
 */
function executeTriOperand(instruction: TriOperandNode) : boolean {
  const [op, cond, set, dest, src, flex] = instruction.unpack();        // unpack the instruction
  if (!SimulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  const n = state.registers[src];
  const m = deflex(flex);                                               // deflex the flex operand into a value
  let result: number | undefined;
  switch (op) {                                                       // check opcode and execute instruction
    case Operation.AND:
      if (set) SimulatorState.setFlags(n, m, n & m);
      result = n & m;
      break;
    case Operation.EOR:
      if (set) SimulatorState.setFlags(n, m, n ^ m);
      result = n ^ m;
      break;
    case Operation.ORR:
      if (set) SimulatorState.setFlags(n, m, n | m);
      result = n | m;
      break;
    case Operation.ADD:
      if (set) SimulatorState.setFlags(n, m, n + m, '+');
      result = n + m;
      break;
    case Operation.SUB:
      if (set) SimulatorState.setFlags(n, m, n - m, '-');
      result = n - m;
      break;
    case Operation.RSB:
      if (set) SimulatorState.setFlags(m, n, m - n, '-');
      result = m - n;
      break;
    case Operation.BIC:
      if (set) SimulatorState.setFlags(m, n, n & (~m));
      result = n & (~m);
      break;
    case Operation.ADC:
      result = n + m + (state.cpsr[Flag.C] ? 1 : 0);
      if (set) SimulatorState.setFlags(n, m, n + m + (state.cpsr[Flag.C] ? 1 : 0), '+');
      break;
    case Operation.SBC:
      result = n - m - (state.cpsr[Flag.C] ? 0 : 1);
      if (set) SimulatorState.setFlags(n, m, n - m - (state.cpsr[Flag.C] ? 0 : 1), '-');
      break;
    case Operation.RSC:
      result = m - n - (state.cpsr[Flag.C] ? 0 : 1);
      if (set) SimulatorState.setFlags(n, m, m - n - (state.cpsr[Flag.C] ? 0 : 1), '-');
      break;
  } 

  if (result === undefined) {
    let instruction = state.memory.text[state.registers[Register.PC]];
    throw new RuntimeError(`While attempting to perform a '${opTitle[op]}' instruction.`, instruction.statement, instruction.lineNumber);
  }

  SimulatorState.setRegister(dest, result);

  return true;
}

/**
 * 
 * @param instruction 
 * @returns 
 */
function executeShift(instruction: ShiftNode) : boolean {
  const [op, cond, set, dest, src1, src2] = instruction.unpack();       // unpack the instruction
  if (!SimulatorState.checkFlags(cond)) return false;                  // returns early if condition code is not satisfied

  const n = state.registers[src1];
  let m;
  if (instruction.isReg) m = state.registers[src2 as Register];
  else m = src2 as number;

  let result;
  switch (op) {                                                        // check opcode and execute instruction
    case Shift.LSL:
      if (set) SimulatorState.setFlags(n, m, n << m);
      result = n << m;
      break;
    case Shift.LSR:
      if (set) SimulatorState.setFlags(n, m, n >> m);
      result = n >>> m;
      break;
    case Shift.ASR:
      if (set) SimulatorState.setFlags(n, m, n >> m);
      result = n >> m;
      break;
    case Shift.ROR:
      if (set) SimulatorState.setFlags(n, m, rotr(n, m));
      result = rotr(n, m);
      break;
    default:
      throw new RuntimeError("While attempting to perform a shift operation.", instruction.statement, instruction.lineNumber);
  }

  SimulatorState.setRegister(dest, result);

  return true;
}

/**
 * 
 * @param instruction 
 * @returns 
 */
async function executeBranch(instruction: BranchNode) : Promise<boolean> {
  const [op, cond, addr] = instruction.unpack();
  if (!SimulatorState.checkFlags(cond)) return false;                          // returns early if condition code is not satisfied

  let address: number;
  if (typeof addr === 'string') {
    address = SimulatorState.label(addr as string);
    if (address === callAddress) {

      let callExecuted = await executeCall(instruction, callMap[addr as string]);
      if (callExecuted) {
        // if branch with link, set the link register
        if (op === Operation.BL) {
          SimulatorState.setRegister(Register.LR, state.registers[Register.PC]);
        }

        // move to link register
        SimulatorState.setRegister(Register.PC, state.registers[Register.LR]);
      }

      return callExecuted;
    }
  }
  else address = state.registers[addr as Register];

  switch (op) {
    case Operation.B:
    case Operation.BX:
      SimulatorState.setRegister(Register.PC, address);
      break;
    case Operation.BL:
      SimulatorState.setRegister(Register.LR, state.registers[Register.PC]);
      SimulatorState.setRegister(Register.PC, address);
      break;
  }

  return true;
}

function executeSingleTransfer(instruction: SingleTransferNode) : boolean {
  const [op, cond, size, reg, addr, sign, flex, mode, wb] = instruction.unpack();
  if (!SimulatorState.checkFlags(cond)) return false;                          // returns early if condition code is not satisfied

  let address: number;
  let postAddress: number;
  let data: number;
  if (typeof addr === "string") {
    address = SimulatorState.dataLabel(addr as string);

    if (op === SingleTransfer.LDR) {
      SimulatorState.setRegister(reg, address);
      return true;
    }

    throw new RuntimeError('Cannot store directly to label.', instruction.statement, instruction.lineNumber);

    // other cases should be caught by assembler
  }
  else {
    address = state.registers[addr as Register];
    const m = flex ? deflex(flex) : 0;
    postAddress = sign === "+" ? address + m : address - m;

    if (mode === "pre") address = postAddress;

  }

  checkAlignment(address, size, instruction);
  if (wb) {
    SimulatorState.setRegister((addr as Register), postAddress);
  }

  switch (op) {
    case SingleTransfer.LDR:
      if (size === "word") data = state.memory.wordView[address / 4];
      else data = state.memory.byteView[address];

      SimulatorState.setRegister(reg, data);
      break;
    case SingleTransfer.STR:
      checkStore(postAddress, addr, instruction);

      if (size === "word") data = state.registers[reg];
      else data = state.registers[reg] & 0xff;

      SimulatorState.store(data, address, size);
      break;
  }

  return true;
}

function executeBlockTransfer(instruction: BlockTransferNode) : boolean {
  let [op, cond, base, reglist, mode, wb] = instruction.unpack();
  if (!SimulatorState.checkFlags(cond)) return false;                          // returns early if condition code is not satisfied

  let address = state.registers[base as Register];
  const increment = addressModeGroup.increment.includes(mode);
  const before = addressModeGroup.before.includes(mode);

  checkAlignment(address, "word", instruction);

  if (!increment) reglist = reglist.slice().reverse();
  switch (op) {
    case BlockTransfer.LDM:
      reglist.forEach(reg => {
        if (before) increment ? address += 4 : address -= 4;

        checkStore(address, base, instruction);
        SimulatorState.setRegister(reg, state.memory.wordView[address / 4]);

        if (!before) increment ? address += 4 : address -= 4;
        if (base === Register.SP) SimulatorState.setStackHeight(state.memory.size - address);
      });

      break;
    case BlockTransfer.STM:
      reglist.forEach(reg => {
        if (before) increment ? address += 4 : address -= 4;
        
        if (base === Register.SP) SimulatorState.setStackHeight(state.memory.size - address);
        checkStore(address, base, instruction);
        SimulatorState.store(state.registers[reg], address, "word");
        
        if (!before) increment ? address += 4 : address -= 4;
      });

      break;
  }

  if (wb) SimulatorState.setRegister((base as Register), address);

  return true;
}

/**
 * Checks that the requested load/store address is aligned with the data size. The instruction is
 * also passed so that runtime errors can be raised. If an error is not thrown then the address can
 * be assumed to be aligned.
 * 
 * @param address byte address to load/store from/to
 * @param size the size of the data to load/store
 * @returns 
 */
function checkAlignment(address: number, size: TTransferSize, instruction: TInstructionNode) : void {
  switch (size) {
    case "byte": return;
    case "word":
      if (address % 4 === 0) return;
  }

  throw new RuntimeError("SIGBUS: Bus error - misaligned access.", instruction.statement, instruction.lineNumber);
}

/**
 * Checks that the requested load/store address is read/writeable in the current context. Checks the 
 * stack pointer post-decrement to ensure that stack is not overflowing. Ensures that data is not 
 * written to the text section. Throws segmentation faults for all errors.
 * 
 * @param address 
 * @param register 
 * @param instruction 
 */
function checkStore(address: number, register: Register, instruction: TInstructionNode) : void {
  if (register === Register.SP) {
    if (address < state.memory.textHeight + state.memory.dataHeight + state.memory.heapHeight) {
      throw new RuntimeError("SIGSEG: Segmentation fault.", instruction.statement, instruction.lineNumber);
    }
    if (address > state.memory.size) {
      throw new RuntimeError("SIGSEG: Segmentation fault.", instruction.statement, instruction.lineNumber);
    }
  }

  else if (address < state.memory.textHeight || address >= state.memory.size) {
    throw new RuntimeError("SIGSEG: Segmentation fault.", instruction.statement, instruction.lineNumber);
  }
}

/**
 * 
 * @param instruction 
 * @returns 
 */
export function generateLabelOffset(label: string, instruction: TInstructionNode): number {
  if (label in state.memory.dataTable) {
    return (state.memory.dataTable[label] - state.previousPC) / 4;
  }

  if (label in state.memory.textMap) {
    return (state.memory.textMap[label] - state.previousPC) / 4;
  }

  throw new ReferenceError(`Missing reference to '${label}'.`, instruction.statement, instruction.lineNumber, -1)
}

export { state };