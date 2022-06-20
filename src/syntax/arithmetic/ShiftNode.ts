import { Condition, condMap, OperandType, Register, Shift, shiftMap } from '@/constants';
import { SyntaxError } from '@/interpreter';
import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { TRegOrImm } from '../types';


/** Class which holds all the information required to execute a bi-operand instruction */
export class ShiftNode extends InstructionNode {
  protected _op: Shift;
  // protected _shiftOp: Shift;
  protected _cond: Condition;
  protected _setFlags: boolean;
  protected _Rd: Register;
  protected _Rn: Register;
  protected _Rs: TRegOrImm;

  protected _type: OperandType | undefined;

  get isReg() { return this._type === OperandType.REGISTER; }
  get isImm() { return this._type === OperandType.IMMEDIATE; }

  /**
   * Responsible for ensuring that the passed information fits the required format
   * for a bi-operand instruction.
   * @param statement the statement to be parsed
   * @param lineNumber the line number of the statement (for debugging)
   * @param currentToken the index of the token to start parsing from
   */
  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
    this._op = shiftMap[operation];
    this._setFlags = modifier.length === 0 ? false : true;
    this._cond = condMap[condition];

    this._Rd = this.parseReg(this.nextToken());
    this.parseComma(this.nextToken());
    this._Rn = this.parseReg(this.nextToken());
    this.parseComma(this.nextToken());

    const [value, type] = this.parseRegOrImm();         
    this._Rs = value;
    this._type = type;
  }

  parseRegOrImm() : [Register | number, OperandType] {
    let flex: Register | number | undefined;
    let type: OperandType | undefined;

    try { 
      flex = this.parseReg(this.peekToken());                       // attempt to parse as register by peeking at the next token
      type = OperandType.REGISTER;
    }                 
    catch (e) { if (!(e instanceof SyntaxError)) throw e }          // rethrow if not syntax error
    
    if (flex === undefined) {
      try { 
        flex = this.parseImm(this.peekToken(), 5);                  // attempt to parse as immediate by peeking at the next token
        type = OperandType.IMMEDIATE;
      }            
      catch (e) { if (!(e instanceof SyntaxError)) throw e }        // rethrow if not syntax error
    }

    if (flex === undefined || type === undefined) {
      throw new SyntaxError(`Expected either REGISTER or IMMEDIATE value - received ${this.peekToken().type} '${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken); 
    }
    
    this.nextToken();                                               // advance token because currently only peeked
    return [flex, type];
  }

  unpack() : [Shift, Condition, boolean, Register, Register, TRegOrImm] {
    return [
      this._op,
      this._cond,
      this._setFlags,
      this._Rd,
      this._Rn,
      this._Rs
    ];
  }

  /**
   * TODO: implement for explanation section
   */
  // assemble(): TAssembled {
    
  // }
}