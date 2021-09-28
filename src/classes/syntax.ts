import { Token } from 'prismjs';
import { SyntaxError } from './error'
import { regMap, Register } from '@/classes/constants';


/** Ancestor class which defines common functions for all child syntax nodes */
export class SyntaxNode {
  statement: Token[];
  lineNumber: number;
  currentToken: number;

  constructor(statement: Token[], lineNumber: number, currentToken = 0) {
    this.statement = statement;
    this.lineNumber = lineNumber;
    this.currentToken = currentToken;
  }

  nextToken(): Token {
    if (this.currentToken < this.statement.length)
      return this.statement[this.currentToken++];
    else throw new SyntaxError("Unexpected instruction end '" + this.statement[this.statement.length - 1].content + "'.", this.statement, this.lineNumber, this.statement.length - 1);
  }

  peekToken(): Token {
    if (this.currentToken < this.statement.length)
      return this.statement[this.currentToken];
    else throw new SyntaxError("Unexpected instruction end '" + this.statement[this.statement.length - 1].content + "'.", this.statement, this.lineNumber, this.statement.length - 1);
  }

  hasToken(): boolean {
    if (this.currentToken < this.statement.length) return true;
    return false;
  }

  parseComma(token: Token): boolean {
    if (token.type == "comma") return true;
    else throw new SyntaxError("COMMA expected between operands - received " + token.type + " '" + token.content + "', instead.", this.statement, this.lineNumber, this.currentToken - 1);
  }

  parseRegister(token: Token): Register {
    if (token.type == "register") return regMap[token.content as string];
    else throw new SyntaxError("REGISTER expected - received " + token.type.toUpperCase() + " '" + token.content + "' instead.", this.statement, this.lineNumber, this.currentToken - 1);
  }

  parseImmediate(token: Token): number {
    let base: number = 0;
    let start: number;
    
    return 1;

    // if (token.type == lexer::IMM_BIN) {
    //   base = 2;
    //   start = token.value().find_last_not_of("01");
    // }
    // else if (token.type() == lexer::IMM_OCT) {
    //   base = 8;
    //   start = token.value().find_last_not_of("01234567");
    // }
    // else if (token.type() == lexer::IMM_DEC) {
    //   base = 10;
    //   start = token.value().find_last_not_of("0123456789");
    // }
    // else if (token.type() == lexer::IMM_HEX) {
    //   base = 16;
    //   start = token.value().find_last_not_of("0123456789abcdef");
    // }
    // else throw SyntaxError("IMMEDIATE value expected - received " + lexer::tokenNames[token.type()] + " '" + token.value() + "' instead.", _statement, token.tokenNumber());

    // return std::strtoull(token.value().substr(start + 1, token.value().size()).c_str(), nullptr, base);
  }
}

/** Ancestor class for all instruction-type syntax nodes (Bi/TriOperandNode etc.) */
class InstructionNode extends SyntaxNode {
  protected splitOpCode(token: Token) {
    
  }
}

/** Class which holds all the information required to execute a bi-operand instruction */
export class BiOperandNode extends InstructionNode {
  /**
   * Responsible for ensuring that the passed information fits the required format
   * for a bi-operand instruction.
   * @param statement the statement to be parsed
   * @param lineNumber the line number of the statement (for debugging)
   * @param currentToken the index of the token to start parsing from
   */
  constructor(statement: Token[], lineNumber: number, currentToken = 0) {
    super(statement, lineNumber, currentToken);
    
  }
}