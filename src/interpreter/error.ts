import { Token } from 'prismjs';

const red = "#dc143c";
const blue = "#6A5ACD";
const amber = "#ffbf00";
type TErrorColour = typeof red | typeof blue | typeof amber;

/**
 * Base error class which provides the basis for catching specific syntax errors
 */
export class IriscError extends Error {
  statement: Token[];
  lineNumber: number;
  tokenIndex: number;
  color: TErrorColour = red;

  get type() : string { return 'IriscError'; }
 
  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super();
    this.message = message;
    this.statement = statement;
    this.lineNumber = lineNumber;
    this.tokenIndex = tokenIndex;
  }

  constructHelper() : string {
    return `${this.lineNumber} : ${this.tokenIndex} ${this.message}`;
  }
}

/**
 * General parser error - unparseable tokens
 */
export class ParserError extends IriscError {
  get type() : string { return 'ParserError'; }

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
} 


/**
 * General syntax error - incorrect token placement
 */
export class SyntaxError extends IriscError {
  get type() : string { return 'SyntaxError'; }

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
} 

/**
 * Numerical error - too large or impossible as an immediate
 */
export class NumericalError extends IriscError {
  get type() : string { return 'NumericalError'; }

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
}

/**
 * Error during assembly
 */
export class AssemblyError extends IriscError {
  get type() : string { return 'AssemblyError'; }
  color: TErrorColour = amber;

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
}

/**
 * Error while validating that all label references exist
 */
export class ReferenceError extends IriscError {
  get type() : string { return 'ReferenceError'; }
  color: TErrorColour = blue;

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
}

/**
 * Error during runtime
 */
export class RuntimeError extends IriscError {
  get type() : string { return 'RuntimeError'; }
  color: TErrorColour = amber;

  constructor(message: string, statement: Token[], lineNumber: number) {
    super(message, statement, lineNumber, -1);
  }
}

/**
 * Error during REPL interaction
 */
 export class InteractiveError extends IriscError {
  get type() : string { return 'InteractiveError'; }

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
  }
}

// /**
//  * LexicalError is slightly different from other errors in that its problem refers to a character within a
//  */
// export class LexicalError extends Error {
//   errorType: string = "Lexical Error";
//   message: string;
//   statement: string;
//   symbolIndex: number;

//   constructor(message: string, statement: string, symbolIndex: number) {
//     super();
//     this.message = message;
//     this.statement = statement;
//     this.symbolIndex = symbolIndex;
//   }
// }
