export enum Directive {
  TEXT, DATA, GLOBAL
}

export const directiveMap: Record<string, Directive> = {
  ".text": Directive.TEXT,
  ".data": Directive.DATA,
  ".global": Directive.GLOBAL
}