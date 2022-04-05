export enum Condition {
  EQ, NE, CS, CC, MI, PL, VS, VC, HI, LS, GE, LT, GT, LE, AL
}

export const condMap: Record<string, Condition> = {
  "eq": Condition.EQ, 
  "ne": Condition.NE, 
  "cs": Condition.CS, 
  "cc": Condition.CC,
  "mi": Condition.MI, 
  "pl": Condition.PL, 
  "vs": Condition.VS, 
  "vc": Condition.VC,
  "hi": Condition.HI, 
  "ls": Condition.LS, 
  "ge": Condition.GE, 
  "lt": Condition.LT, 
  "gt": Condition.GT, 
  "le": Condition.LE, 
  "al": Condition.AL,   
  "":   Condition.AL
}