export enum Shift {
  LSL, LSR, ASR, ROR
}

export const shiftMap: Record<string, Shift> = {
  "lsl":  Shift.LSL, 
  "lsr":  Shift.LSR,   
  "asr":  Shift.ASR,   
  "ror":  Shift.ROR
};

export const shiftTitle: Record<Shift, string> = {
  [Shift.LSL]: "Logical Shift Left", 
  [Shift.LSR]: "Logical Shift Right", 
  [Shift.ASR]: "Arithmetic Shift Right", 
  [Shift.ROR]: "Rotate Right"
};