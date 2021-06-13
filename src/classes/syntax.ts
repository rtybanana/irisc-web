import { Token } from 'prismjs';
import { SyntaxError } from './error'

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

  nextToken() {
    if (this.currentToken < this.statement.length)
      return this.statement[this.currentToken++];
    else throw new SyntaxError("Unexpected instruction end '" + this.statement[this.statement.length - 1].content + "'.", this.statement, this.lineNumber, this.statement.length - 1);
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