export * from "./operations";
export * from "./registers";
export * from "./conditions";
export * from "./shifts";
export * from "./flags";
export * from "./transfer";
export * from "./allocation";
export * from "./directives";
export * from "./terminal";
// export { pages as tutorialPages, TTutorialPage } from "../tutorial/tutorial";


export const operations = [
  // bi-operand instructions
  "mov", "mvn", "tst", "teq", "cmp", "cmn",

  // tri-operand instructions
  "and", "eor", "sub", "rsb", "add",
  "adc", "sbc", "rsc", "orr", "bic",

  // multiply instructions
  "mul", "mla", "mls",

  // shift instructions
  "lsl", "lsr", "asr", "ror",
  
  // load/store 
  "ldr", "str", "ldm", "stm", "push", "pop",

  // branch instructions
  "bx", "bl", "b",  
]

export enum OperandType { REGISTER, IMMEDIATE }

export enum EnvironmentType {
  TERMINAL = "terminal",
  EDITOR = "editor"
}

