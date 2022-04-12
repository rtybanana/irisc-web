export * from "./operations";
export * from "./registers";
export * from "./conditions";
export * from "./shifts";
export * from "./flags";
export { pages as tutorialPages, TTutorialPage } from "./tutorial";


export const operations = [
  // bi-operand instructions
  "mov", "mvn", "tst", "teq", "cmp", "cmn",

  // tri-operand instructions
  "and", "eor", "sub", "rsb", "add",
  "adc", "sbc", "rsc", "orr", "bic",

  // shift instructions
  "lsl", "lsr", "asr", "ror",
  
  //load/store 
  "ldr", "str",

  // branch instructions
  "bx", "bl", "b",  
]

export enum OperandType { REGISTER, IMMEDIATE }

export enum EnvironmentType {
  TERMINAL = "terminal",
  EDITOR = "editor"
}

export const replWelcome = // html
`
  <span class="welcome">\
    Welcome to the iRISC 2.0 repl interface.

    Here you are able to execute single ARMv7 commands and immediately see the effect using a command-line interface.\
    Simply type a valid ARM instruction on the prompt below to begin.\
  </span>
  &nbsp;\
`