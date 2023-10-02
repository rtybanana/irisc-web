export enum Register {
  R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, SP, LR, PC
}

export const regName: string[] = [
  "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12", "sp", "lr", "pc"
]

export const regMap: Record<string, Register> = {
  "r0":  Register.R0, 
  "r1":  Register.R1,   
  "r2":  Register.R2,   
  "r3":  Register.R3,
  "r4":  Register.R4,   
  "r5":  Register.R5,   
  "r6":  Register.R6,   
  "r7":  Register.R7,
  "r8":  Register.R8,   
  "r9":  Register.R9,  
  "r10": Register.R10,  
  "r11": Register.R11, 
  "r12": Register.R12,   
  "sp":  Register.SP,   
  "lr":  Register.LR,   
  "pc":  Register.PC  
};

export const regTitle: Record<Register, string> = {
  [Register.R0]: "Register 0", 
  [Register.R1]: "Register 1",   
  [Register.R2]: "Register 2",   
  [Register.R3]: "Register 3",
  [Register.R4]: "Register 4",   
  [Register.R5]: "Register 5",   
  [Register.R6]: "Register 6",   
  [Register.R7]: "Register 7",
  [Register.R8]: "Register 8",   
  [Register.R9]: "Register 9",  
  [Register.R10]: "Register 10",  
  [Register.R11]: "Register 11", 
  [Register.R12]: "Register 12",   
  [Register.SP]: "Stack Pointer",   
  [Register.LR]: "Link Register",   
  [Register.PC]: "Program"  
};

export const regShortTitle: Record<Register, string> = {
  [Register.R0]: "r0", 
  [Register.R1]: "r1",   
  [Register.R2]: "r2",   
  [Register.R3]: "r3",
  [Register.R4]: "r4",   
  [Register.R5]: "r5",   
  [Register.R6]: "r6",   
  [Register.R7]: "r7",
  [Register.R8]: "r8",   
  [Register.R9]: "r9",  
  [Register.R10]: "r10",  
  [Register.R11]: "r11", 
  [Register.R12]: "r12",   
  [Register.SP]: "sp",   
  [Register.LR]: "lr",   
  [Register.PC]: "pc"  
};

export const regDescribe: Record<Register, string> = {
  [Register.R0]: "General Purpose Register.", 
  [Register.R1]: "General Purpose Register.", 
  [Register.R2]: "General Purpose Register.", 
  [Register.R3]: "General Purpose Register.", 
  [Register.R4]: "General Purpose Register.", 
  [Register.R5]: "General Purpose Register.", 
  [Register.R6]: "General Purpose Register.", 
  [Register.R7]: "General Purpose Register.", 
  [Register.R8]: "General Purpose Register.", 
  [Register.R9]: "General Purpose Register.", 
  [Register.R10]: "General Purpose Register.", 
  [Register.R11]: "General Purpose Register.",  
  [Register.R12]: "General Purpose Register.", 
  [Register.SP]: "The memory address for the top of the stack.", 
  [Register.LR]: "The return address of the current function.", 
  [Register.PC]: "The memory address of the next instruction.", 
};