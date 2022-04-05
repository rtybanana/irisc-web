import { Token } from 'prismjs';
import { SyntaxError, NumericalError } from '../error'
import { Register, regMap } from '@/constants';
import { ffs, fls, rotr } from '@/assets/bitset';

/** Ancestor class which defines common functions for all child syntax nodes */
export class SyntaxNode {
  protected _statement: Token[];
  protected _lineNumber: number;
  protected _currentToken: number;

  // getters
  get statement(): Token[] { return this._statement; }
  get lineNumber(): number { return this._lineNumber; }

  /**
   * 
   * @param statement 
   * @param lineNumber 
   * @param currentToken 
   */
  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    this._statement = statement;
    this._lineNumber = lineNumber;
    this._currentToken = currentToken;
  }

  /**
   * 
   * @returns 
   */
  nextToken(): Token {
    if (this._currentToken < this._statement.length)
      return this._statement[this._currentToken++];
    else throw new SyntaxError("Unexpected instruction end '" + this._statement[this._statement.length - 1].content + "'.", this._statement, this._lineNumber, this._statement.length - 1);
  }

  /**
   * 
   * @returns 
   */
  peekToken(): Token {
    if (this._currentToken < this._statement.length)
      return this._statement[this._currentToken];
    else throw new SyntaxError("Unexpected instruction end '" + this._statement[this._statement.length - 1].content + "'.", this._statement, this._lineNumber, this._statement.length - 1);
  }

  /**
   * 
   * @returns 
   */
  hasToken(): boolean {
    if (this._currentToken < this._statement.length) return true;
    return false;
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  parseComma(token: Token): boolean {
    if (token.type == "comma") return true;
    else throw new SyntaxError("COMMA expected between operands - received " + token.type + " '" + token.content + "', instead.", this._statement, this._lineNumber, this._currentToken - 1);
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  parseReg(token: Token): Register {
    if (token.type == "register") return regMap[token.content as string];
    else throw new SyntaxError("REGISTER expected - received " + token.type.toUpperCase() + " '" + token.content + "' instead.", this._statement, this._lineNumber, this._currentToken - 1);
  }

  /**
   * 
   * @param token 
   * @param bits 
   * @returns 
   */
  parseImm(token: Token, bits?: number): number {
    let base: number = 0;
    let start: number;
    let reveresedToken = [...(token.content as string)].reverse();

    if (token.alias == "bin") {
      base = 2;
      start = reveresedToken.findIndex(e => !"01".includes(e));
    }
    else if (token.alias == "oct") {
      base = 8;
      start = reveresedToken.findIndex(e => !"01234567".includes(e));
    }
    else if (token.alias == "dec") {
      base = 10;
      start = reveresedToken.findIndex(e => !"0123456789".includes(e));
    }
    else if (token.alias == "hex") {
      base = 16;
      start = reveresedToken.findIndex(e => !"0123456789abcdef".includes(e));
    }
    else throw new SyntaxError("IMMEDIATE value expected - received " + token.type.toUpperCase() + " '" + token.content + "' instead.", this._statement, this._lineNumber, this._currentToken);

    start = reveresedToken.length - start;
    let imm: number = parseInt((token.content as string).slice(start), base);

    if (!bits || imm < Math.pow(2, bits)) return imm;
    else throw new NumericalError("IMMEDIATE value '" + token.content + "' (decimal " + imm + ") is greater than the " + bits + "-bit maximum.", this._statement, this._lineNumber, this._currentToken)
    
  }

  /**
   * 
   * @param token 
   * @param bits 
   * @returns 
   */
  parseShiftedImm(token: Token, bits: number): [number, number] {
    let imm: number = this.parseImm(token);
    let shift = 0;

    if (imm == 0) return [imm, shift];    // return 0 if imm == 0 (short circuit)

    let bottombit: number = ffs(imm);
    let topbit: number = fls(imm);

    if (topbit > 31)
      throw new NumericalError(`IMMEDIATE value '${token.content}' (decimal ${imm}) cannot be represented in 32 bits.`, this._statement, this._lineNumber, this._currentToken);
    if ((topbit - bottombit) > --bits)
      throw new NumericalError(`IMMEDIATE value '${token.content}' (decimal ${imm}) cannot be implicitly represented with a maximum set-bit width of ${bits}.`, this._statement, this._lineNumber, this._currentToken);
    
    if (topbit > bits) { 
      imm = rotr(imm, topbit - 7);
      shift = 32 - (topbit - 7);
    }
      
    return [imm, shift];
  }

}