import { Token } from 'prismjs';

class IriscError extends Error {
  message: string;
  statement: Token[];
  tokenIndex: number;
  lineNumber: number;

  constructor(message: string, statement: Token[], tokenIndex: number, lineNumber: number) {
    super();
    this.message = message;
    this.statement = statement;
    this.tokenIndex = tokenIndex;
    this.lineNumber = lineNumber;
  }

  constructHelper() {
    let helper: string = "";

    this.statement.forEach((e: Token, i: number) => {
      // let problemToken: boolean = i == this.tokenIndex;
      helper += `${e.type == "comma" ? "" : " "}${e.content}`;
    });
  }
}

export class SyntaxError extends IriscError {
  constructor(message: string, statement: Token[], tokenIndex: number, lineNumber: number) {
    super(message, statement, tokenIndex, lineNumber);
  }

  what() {

  }
} 