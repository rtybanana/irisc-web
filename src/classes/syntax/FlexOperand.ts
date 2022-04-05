import { Token } from 'prismjs';
import { InstructionNode } from "./InstructionNode";
import { SyntaxError } from '../error';
import { Register, Operation, Condition, Shift, regMap, opMap, condMap, shiftMap, OperandType } from '@/constants';
import { ffs, fls, rotr } from '@/assets/bitset';
import { BIconHandThumbsDown } from 'bootstrap-vue';

export class FlexOperand extends InstructionNode {
  protected _Rm: Register | number;
  protected _Rs: Register | number | undefined;
  protected _shift: Shift | undefined;
  protected _immShift: number = 0;

  protected _type: OperandType | undefined;
  protected _shiftType: OperandType | undefined;

  get isReg() { return this._type === OperandType.REGISTER; }
  get isImm() { return this._type === OperandType.IMMEDIATE; }
  get shifted() { return this._Rs !== undefined; }
  get shiftedByReg() { return this._shiftType === OperandType.REGISTER; }
  get shiftedByImm() { return this._shiftType === OperandType.IMMEDIATE; }

  /**
   * 
   * @param statement 
   * @param lineNumber 
   * @param currentToken 
   */
  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    this.parseComma(this.nextToken());
    let [value, type] = this.parseRegOrImm();      // parse immediate with default 8 bits (with extended 4 bit shift)
    this._Rm = value;
    this._type = type;

    if (this.isReg && this.hasToken()) this.parseShift();

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
  }

  /**
   * 
   * @param immBits 
   * @returns 
   */
  parseRegOrImm(immBits: number = 8): [Register | number, OperandType] {
    let flex: Register | number | undefined;
    let type: OperandType | undefined;

    try { 
      flex = this.parseReg(this.peekToken()); 
      type = OperandType.REGISTER
    }
    catch (e) { if (!(e instanceof SyntaxError)) throw e }  // rethrow if not syntax error

    if (flex === undefined) {
      try { 
        if (immBits == 8) {
          const [imm, shift] = this.parseShiftedImm(this.peekToken(), immBits);
          flex = imm;
          this._immShift = shift
        }
        else flex = this.parseImm(this.peekToken(), immBits);

        type = OperandType.IMMEDIATE;
      }
      catch (e) { if (!(e instanceof SyntaxError)) throw e }  // rethrow if not syntax error
    }

    if (flex === undefined || type === undefined) 
      throw new SyntaxError(`Expected either REGISTER or IMMEDIATE value - received ${this.peekToken().type.toUpperCase()} '${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken); 

    this.nextToken();   // advance to the next token as parse attempts only peeked

    return [flex, type];
  }

  /**
   * 
   */
  parseShift() {
    this.parseComma(this.nextToken());
    if (this.peekToken().type === "shift") {
      this._shift = shiftMap[this.nextToken().content as string]
    }
    else throw new SyntaxError(`The comma after the final operand indicates an optional shift, but no shift was found.`, this._statement, this._lineNumber, this._currentToken);
    
    let [value, type] = this.parseRegOrImm(5);     // parse immediate with a max length of 5 bits
    this._Rs = value;
    this._shiftType = type;
  }
}