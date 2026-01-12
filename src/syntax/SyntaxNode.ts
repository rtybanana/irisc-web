import { bitset, ffs, fls, rotr } from '@/assets/bitset';
import { Register, regMap } from '@/constants';
import { Token } from 'prismjs';
import { NumericalError, SyntaxError } from '../interpreter/error';
import { tokens } from '@/constants/tokens';
import { AchievementState } from '@/achievements';

/** Ancestor class which defines common functions for all child syntax nodes */
export class SyntaxNode {
  protected _statement: Token[];
  protected _lineNumber: number;
  protected _currentToken: number;

  // getters
  get statement(): Token[] { return this._statement; }
  get lineNumber(): number { return this._lineNumber; }
  get currentToken() : number { return this._currentToken; }

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
  previousToken() : Token {
    if (this._currentToken > 0)
      return this._statement[this._currentToken - 1];
    else throw new SyntaxError("Could not assemble instruction - please contact the developer.", this.statement, this.lineNumber, -1);
  }

  /**
   * 
   * @returns 
   */
  nextToken() : Token {
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
  hasToken() : boolean {
    if (this._currentToken < this._statement.length) return true;
    return false;
  }

  /**
   * 
   * @param index 
   * @returns 
   */
  getToken(index: number) : Token {
    if (index < this._statement.length) {
      return this._statement[index];
    }

    throw new SyntaxError("Unexpected instruction end '" + this._statement[this._statement.length - 1].content + "'.", this._statement, this._lineNumber, this._statement.length - 1);
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  parseComma(token: Token) : boolean {
    if (token.type == "comma") return true;
    else throw SyntaxError.badToken(tokens.comma, token, this._statement, this._lineNumber, this._currentToken);
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  parseReg(token: Token) : Register {
    if (token.type == "register") return regMap[token.content as string];
    else throw SyntaxError.badToken(tokens.register, token, this._statement, this._lineNumber, this._currentToken);
  }

  /**
   * 
   * @param token 
   * @param bits 
   * @returns 
   */
  parseImm(token: Token, bits?: number) : number {
    if (token.type != tokens.immediate) {
      throw SyntaxError.badToken(tokens.immediate, token, this._statement, this._lineNumber, this._currentToken);
    }
    
    return this.parseNum(token, bits);
  }

  parseNum(token: Token, bits?: number) : number {
    let base: number = 0;
    let start: number;
    const reveresedToken = [...(token.content as string)].reverse();

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
    else throw SyntaxError.badToken(tokens.immediate, token, this._statement, this._lineNumber, this._currentToken);

    // correct start index for tokens which don't have '#' or '0n' identifiers
    start = start === -1 ? reveresedToken.length : start;
    
    start = reveresedToken.length - start;
    const imm: number = parseInt((token.content as string).slice(start), base);

    if (!bits || imm < Math.pow(2, bits)) return imm;
    else throw new NumericalError("IMMEDIATE value '" + token.content + "' (decimal " + imm + ") is greater than the " + bits + "-bit maximum.", this._statement, this._lineNumber, this._currentToken)
  }

  /**
   * 
   * @param token 
   * @param bits 
   * @returns 
   */
  parseShiftedImm(token: Token, bits: number) : [number, number] {
    let imm: number = this.parseImm(token);
    let shift = 0;

    if (imm == 0) return [imm, shift];    // return [0, 0] if imm == 0 (short circuit)
    if (imm > 0xffffffff) {
      throw new NumericalError(
        `IMMEDIATE value '${token.content}' (decimal ${imm}) cannot be represented in 32 bits.`, 
        this._statement, 
        this._lineNumber, 
        this._currentToken
      );
    }

    const bottombit: number = ffs(imm);
    const topbit: number = fls(imm);

    if (topbit > 31) {
      throw new NumericalError(
        `IMMEDIATE value '${token.content}' (decimal ${imm}) cannot be represented in 32 bits.`, 
        this._statement, 
        this._lineNumber, 
        this._currentToken
      );
    }

    if ((topbit - bottombit) > bits - 1) {
      const validRolledCorner = this.isValidRolledCorner(token, imm, bits);
      [imm, shift] = validRolledCorner as [number, number];
    }
    else {
      // TODO: check for odd rotation edge-case
      if (topbit > bits - 1) { 
        imm = rotr(imm, Math.floor((topbit - (bits - 2)) / 2) * 2);
        shift = 32 - (Math.floor((topbit - (bits - 2)) / 2) * 2);
      }
    }

    // if shift amount is odd
    if (shift % 2 !== 0) {
      throw new NumericalError(`The barrel shifter can only rotate an IMMEDIATE value by an even number of bits.`, this._statement, this._lineNumber, this._currentToken);
    }
      
    return [(imm & 0xff) >>> 0, shift];
  }

  /**
   * This checks a very specific edge case where a rotated immediate value is halfway through rolling round
   * the corner of the word. For example: 0xf000000f, where the valid 8-bit number 0xff has been rotated
   * by the equally valid value 4, but the immediate representation is disallowed because the distance
   * between the maximum set-bit (31) and the minimum set-bit (0) is greater than 8.
   * 
   * @param imm 
   * @param bits 
   */
  isValidRolledCorner(token: Token, imm: number, bits: number): boolean | [number, number] {
    const bottomBits = (imm & 0xff) >>> 0;
    const correctiveRotation = Math.ceil((fls(bottomBits) + 1) / 2) * 2;

    const testImm = rotr((imm >>> 0), correctiveRotation);
    const bottombit: number = ffs(testImm);
    const topbit: number = fls(testImm);

    // catches cases where the rolled corner number cannot be represented within the target bit width
    if ((topbit - bottombit) > bits - 1) {
      throw new NumericalError(
        `IMMEDIATE value '${token.content}' (decimal ${imm}) cannot be implicitly represented with a maximum set-bit width of ${bits}.`, 
        this._statement, 
        this._lineNumber, 
        this._currentToken
      );
    }

    // catches cases where the rolled corner CAN be represented within the target bit width
    // BUT rotating by an even number forces the top bit out of the 8 bit range into the 9th bit
    if (bottombit <= 23) {
      AchievementState.achieve("Edge Case Pro");

      throw new NumericalError(
        `IMMEDIATE value '${token.content} (decimal ${imm}) cannot be implicitly represented within 8 bits with the restriction that it is rotated an even number of times.\n\nThis is a complicated edge-case of the barrel shifter, so well done for discovering it. If you would like to learn more, I suggest researching the rules of the barrel shifter yourself. The ARMv7-A reference manual should contain everything you need.`, 
        this._statement, 
        this._lineNumber, 
        this._currentToken
      );
    }

    /**
     * return [imm, shift] where
     *    imm is the corrected immediate expressed as an 8 bit number
     *    shift is the smallest even rotation to move the immediate into the first 8 bits of the word
     */
    return [
      (rotr(testImm, 24) & 0xff) >>> 0, 
      8 - correctiveRotation
    ];
  }

}