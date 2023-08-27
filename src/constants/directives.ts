export enum Directive {
  // GLOBAL
  TEXT, DATA,  EXTERN
}

export const directiveMap: Record<string, Directive> = {
  ".text": Directive.TEXT,
  ".data": Directive.DATA,
  // ".global": Directive.GLOBAL,
  ".extern": Directive.EXTERN
}

export enum Call {
  // stdout
  PUTCHAR, PUTS, PRINTF, 
  
  // allocation
  MALLOC, FREE
}

export const callMap: Record<string, Call> = {
  "putchar": Call.PUTCHAR,
  "puts": Call.PUTS,
  "printf": Call.PRINTF,
  "malloc": Call.MALLOC,
  "free": Call.FREE
}

export const callAddress = -4;