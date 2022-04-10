export enum Flag {
  N,  // negative
  Z,  // zero
  C,  // carry
  V   // overflow
}

export const flagName: Record<Flag, string> = {
  [Flag.N]: "N", 
  [Flag.Z]: "Z", 
  [Flag.C]: "C", 
  [Flag.V]: "V"
}

export const flagTitle: Record<Flag, string> = {
  [Flag.N]: "Negative Flag (N)", 
  [Flag.Z]: "Zero Flag (Z)", 
  [Flag.C]: "Carry Flag (C)", 
  [Flag.V]: "Overflow Flag (V)"
}

export const flagExplain: Record<Flag, string> = {
  [Flag.N]: "This bit is set when the signed result of the operation is negative.", 
  [Flag.Z]: "This bit is set when the result of the operation is equal to zero.", 
  [Flag.C]: "This bit is set when the operation results in an unsigned overflow.", 
  [Flag.V]: "This bit is set when the operation results in a signed overflow."
}

export const setFlagsExplain: string[] = [
  "Do not set the CPSR flags based on the result of this instruction.",
  "Set the CPSR flags based on the result of this instruction."
];