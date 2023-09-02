export enum Directive {
  // memory subsections
  TEXT, DATA, 

  // linkage
  EXTERN,

  // alignment
  BALIGN
}

export const directiveMap: Record<string, Directive> = {
  // ".global": Directive.GLOBAL,

  // memory subsections
  ".text": Directive.TEXT,
  ".data": Directive.DATA,
  
  // linkage
  ".extern": Directive.EXTERN,

  // alignment
  ".balign": Directive.BALIGN
}

export enum Call {
  // stdout
  PUTCHAR, PUTS, PRINTF, 

  // stdin
  GETS, SCANF,
  
  // allocation
  MALLOC, CALLOC, FREE
}

export const callMap: Record<string, Call> = {
  // stdout
  "putchar": Call.PUTCHAR,
  "puts": Call.PUTS,
  "printf": Call.PRINTF,

  // stdin
  "gets": Call.GETS,
  "scanf": Call.SCANF,

  // allocation
  "malloc": Call.MALLOC,
  "calloc": Call.CALLOC,
  "free": Call.FREE
}

export const callAddress = -4;