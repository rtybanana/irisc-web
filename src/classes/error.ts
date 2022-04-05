import { Token } from 'prismjs';

/**
 * Base error class which provides the basis for catching specific syntax errors
 */
class IriscError extends Error {
  // errorType: string | null = null;
  message: string;
  statement: Token[];
  lineNumber: number;
  tokenIndex: number;

  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super();
    this.message = message;
    this.statement = statement;
    this.lineNumber = lineNumber;
    this.tokenIndex = tokenIndex;
  }
}

/**
 * General syntax error - incorrect token placement
 */
export class SyntaxError extends IriscError {
  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
    // this.errorType = "Syntax Error"
  }
} 

/**
 * Numerical error - too large or impossible as an immediate
 */
export class NumericalError extends IriscError {
  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
    // this.errorType = "Numerical Error"
  }
}

/**
 * Error during assembly
 */
export class AssemblyError extends IriscError {
  constructor(message: string, statement: Token[], lineNumber: number, tokenIndex: number) {
    super(message, statement, lineNumber, tokenIndex);
    // this.errorType = "Assembly Error"
  }
}

/**
 * Error during runtime
 */
export class RuntimeError extends IriscError {
  constructor(message: string, statement: Token[], tokenIndex: number, lineNumber: number) {
    super(message, statement, tokenIndex, lineNumber);
    // this.errorType = "Runtime Error"
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
