export enum SingleTransfer  { LDR, STR }
export enum BlockTransfer   { LDM, STM }
export enum StackTransfer   { POP, PUSH }
export type TTransfer = SingleTransfer | BlockTransfer | StackTransfer;

export const transferMap: Record<string, TTransfer> = {
  "ldr":  SingleTransfer.LDR,
  "str":  SingleTransfer.STR,
  "ldm":  BlockTransfer.LDM,
  "stm":  BlockTransfer.STM,
  "push": StackTransfer.PUSH,
  "pop":  StackTransfer.POP
}

export const transferTitle: Record<TTransfer, string> = {
  [SingleTransfer.LDR]:   "Load Single",
  [SingleTransfer.STR]:   "Store Single",
  [BlockTransfer.LDM]:    "Load Multiple",
  [BlockTransfer.STM]:    "Store Multiple",
  [StackTransfer.PUSH]:   "Stack Push",
  [StackTransfer.POP]:    "Stack Pop"
}

export const transferExplain: Record<TTransfer, string> = {
  [SingleTransfer.LDR]:   "Loads a single byte or word of data from memory.",
  [SingleTransfer.STR]:   "Stores a single byte or work of data into memory.",
  [BlockTransfer.LDM]:    "Loads multiple bytes or words of data from memory.",
  [BlockTransfer.STM]:    "Stores multiple bytes or words of data into memory.",
  [StackTransfer.PUSH]:   "Shorthand for storing multiple words to the stack.",
  [StackTransfer.POP]:    "Shorthand for loading multiple words from the stack.",
}

export enum BlockAddressMode {
  IA, DA, IB, DB
} 

export const blockAddressModeMap: Record<string, BlockAddressMode> = {
  "ia": BlockAddressMode.IA,
  "da": BlockAddressMode.DA,
  "ib": BlockAddressMode.IB,
  "db": BlockAddressMode.DB,
}

const plus = "+";
const minus = "-";
export type TSign = typeof plus | typeof minus;

const pre = "pre";
const post = "post";
export type TAddressMode = typeof pre | typeof post; 

const word = "word";
const byte = "byte";
export type TTransferSize = typeof word | typeof byte;