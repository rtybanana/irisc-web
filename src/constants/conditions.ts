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

export const condTitle: Record<Condition, string> = {
  [Condition.EQ]: "Equal", 
  [Condition.NE]: "Not Equal", 
  [Condition.CS]: "Unsigned More Than or Equal to", 
  [Condition.CC]: "Unsigned Less Than",
  [Condition.MI]: "Negative", 
  [Condition.PL]: "Positive or Zero",
  [Condition.VS]: "Overflow", 
  [Condition.VC]: "No Overflow",
  [Condition.HI]: "Unsigned More Than", 
  [Condition.LS]: "Unsigned Less Than or Equal to",
  [Condition.GE]: "Signed More Than or Equal to", 
  [Condition.LT]: "Signed Less Than",
  [Condition.GT]: "Signed More Than", 
  [Condition.LE]: "Signed Less Than or Equal to",
  [Condition.AL]: "Always"
};

export const condExplain: Record<Condition, string> = {
  [Condition.EQ]: "The instruction is only executed if the zero flag (Z) is set.", 
  [Condition.NE]: "The instruction is only executed if the zero flag (Z) is clear.", 
  [Condition.CS]: "The instruction is only executed if the carry flag (C) is set.", 
  [Condition.CC]: "The instruction is only executed if the carry flag (C) is clear.",
  [Condition.MI]: "The instruction is only executed if the negative flag (N) is set.", 
  [Condition.PL]: "The instruction is only executed if the negative flag (N) is clear.",
  [Condition.VS]: "The instruction is only executed if the overflow flag (V) is set.", 
  [Condition.VC]: "The instruction is only executed if the overflow flag (V) is clear.",
  [Condition.HI]: "The instruction is only executed if the carry flag (C) is set AND the zero flag (Z) is clear.",
  [Condition.LS]: "The instruction is only executed if the carry flag (C) is clear OR the zero flag (Z) is set.",
  [Condition.GE]: "The instruction is only executed if the negative flag (N) and the overflow flag (V) are the same.",
  [Condition.LT]: "The instruction is only executed if the negative flag (N) and the overflow flag (V) are different.",
  [Condition.GT]: "The instruction is only executed if the zero flag (Z) is clear and the negative (N) and overflow (V) flags are the same.",
  [Condition.LE]: "The instruction is only executed if the zero flag (Z) is set and the negative (N) and overflow (V) flags are different.",
  [Condition.AL]: "The instruction is executed unconditionally. This is the default condition."
};

export const condShortExplain: Record<Condition, string> = {
  [Condition.EQ]: "If the zero flag (Z) is set.", 
  [Condition.NE]: "If the zero flag (Z) is clear.", 
  [Condition.CS]: "If the carry flag (C) is set.", 
  [Condition.CC]: "If the carry flag (C) is clear.",
  [Condition.MI]: "If the negative flag (N) is set.", 
  [Condition.PL]: "If the negative flag (N) is clear.",
  [Condition.VS]: "If the overflow flag (V) is set.", 
  [Condition.VC]: "If the overflow flag (V) is clear.",
  [Condition.HI]: "If the carry flag (C) is set AND the zero flag (Z) is clear.",
  [Condition.LS]: "If the carry flag (C) is clear OR the zero flag (Z) is set.",
  [Condition.GE]: "If the negative flag (N) and the overflow flag (V) are the same.",
  [Condition.LT]: "If the negative flag (N) and the overflow flag (V) are different.",
  [Condition.GT]: "If the zero flag (Z) is clear and the negative (N) and overflow (V) flags are the same.",
  [Condition.LE]: "If the zero flag (Z) is set and the negative (N) and overflow (V) flags are different.",
  [Condition.AL]: "Unconditionally. This is the default condition."
};