export enum Shift {
  LSL, LSR, ASR, ROR
}

export const shiftMap: Record<string, Shift> = {
  "lsl":  Shift.LSL, 
  "lsr":  Shift.LSR,   
  "asr":  Shift.ASR,   
  "ror":  Shift.ROR
};