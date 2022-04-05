export enum Operation {
  // arithmetic operations
  AND = 0,  EOR, SUB, RSB, ADD, ADC, SBC, RSC, TST, TEQ, CMP, CMN, ORR, MOV, BIC, MVN,

  // load/store instructions
  LDR = 16,  STR, 

  // branch instructions
  B = 32,  BL, BX
}

/**
 * Mapping strings to Operations
 */
export const opMap: Record<string, Operation> = {
  // arithmetic instructions
  "and": Operation.AND,
  "eor": Operation.EOR, 
  "sub": Operation.SUB,
  "rsb": Operation.RSB,

  "add": Operation.ADD,
  "adc": Operation.ADC,
  "sbc": Operation.SBC,
  "rsc": Operation.RSC,

  "tst": Operation.TST,
  "teq": Operation.TEQ,
  "cmp": Operation.CMP,
  "cmn": Operation.CMN,

  "orr": Operation.ORR,
  "mov": Operation.MOV,
  "bic": Operation.BIC,
  "mvn": Operation.MVN,

  //load/store instructions
  "ldr": Operation.LDR,
  "str": Operation.STR,

  // branch instructions
  "bx": Operation.BX,
  "bl": Operation.BL, 
   "b": Operation.B 
};

export const opTitle: Record<Operation, string> = {
  [Operation.AND]: "Bitwise AND",
  [Operation.EOR]: "Bitwise XOR",
  [Operation.SUB]: "Subtraction",
  [Operation.RSB]: "Reverse Subtraction",
  [Operation.ADD]: "Addition",
  [Operation.ADC]: "Add with Carry",
  [Operation.SBC]: "Subtract with Carry",
  [Operation.RSC]: "Reverse Subtraction with Carry",
  [Operation.TST]: "Test",
  [Operation.TEQ]: "Test Equivalence",
  [Operation.CMP]: "Compare",
  [Operation.CMN]: "Compare Negative",
  [Operation.ORR]: "Bitwise OR",
  [Operation.MOV]: "Move",
  [Operation.BIC]: "Bit Clear",
  [Operation.MVN]: "Move Negative",
  [Operation.LDR]: "Load",
  [Operation.STR]: "Store",
  [Operation.B]:   "Branch",
  [Operation.BL]:  "Branch and Link",
  [Operation.BX]:  "Branch and Exchange"
};

export const opExplain: Record<Operation, string> = {
  [Operation.AND]: "Performs a bitwise AND operation and stores the result.", 
  [Operation.EOR]: "Performs a bitwise exclusive OR operation and stores the result.", 
  [Operation.SUB]: "Performs an arithmetic subtraction from left to right and stores the result.", 
  [Operation.RSB]: "Performs an arithmetic subtraction from right to left and stores the result.",
  [Operation.ADD]: "Performs an arithmetic addition and stores the result.", 
  [Operation.ADC]: "???",
  [Operation.SBC]: "???", 
  [Operation.RSC]: "???",
  [Operation.TST]: "Performs a bitwise AND operation, sets the CPSR flags and discards the result.",
  [Operation.TEQ]: "Performs a bitwise XOR operation, sets the CPSR flags and discards the result.",
  [Operation.CMP]: "Performs an arithmetic subtraction, sets the CPSR flags and discards the result.",
  [Operation.CMN]: "Performs an arithmetic addition, sets the CPSR flags and discards the result.",
  [Operation.ORR]: "Performs a bitwise OR operation and stores the result.",
  [Operation.MOV]: "Stores the second operand value in the destination register.",
  [Operation.BIC]: "Performs a bitwise AND operation with the complement of the second operand.",
  [Operation.MVN]: "Stores the additive inverse of the second operand value in the destination register.",
  [Operation.LDR]: "Loads the data at the memory address in the source register into the destination register.",
  [Operation.STR]: "Stores the data in the destination register into the memory address of the source register.",
  [Operation.B]:   "Branches to the provided instruction address or label.",
  [Operation.BL]:  "Branches to the provided instruction address or label and stores the return address.",
  [Operation.BX]:  "Branches to the provided instruction address or label and optionally changes instruction type."
};