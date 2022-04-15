import { Token } from 'prismjs';
import { InstructionNode } from './InstructionNode';
import { FlexOperand } from './FlexOperand';
import { Register, Operation, Condition, opMap, condMap } from '@/constants';


/** Class which holds all the information required to execute a bi-operand instruction */
export class TriOperandNode extends InstructionNode {
  protected _op: Operation;
  protected _cond: Condition;
  protected _setFlags: boolean = false;
  protected _Rd: Register;
  protected _Rn: Register;
  protected _flex: FlexOperand;

  /**
   * Responsible for ensuring that the passed information fits the required format
   * for a tri-operand instruction.
   * @param statement the statement to be parsed
   * @param lineNumber the line number of the statement (for debugging)
   * @param currentToken the index of the token to start parsing from
   */
  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
    this._op = opMap[operation];
    this._setFlags = modifier.length === 0 ? false : true;
    this._cond = condMap[condition];

    this._Rd = this.parseReg(this.nextToken());
    this.parseComma(this.nextToken());
    this._Rn = this.parseReg(this.nextToken());

    this.peekToken();                                              // peek next token to see if it exists
    this._flex = new FlexOperand(statement, lineNumber, this._currentToken);          // parsing delegated to FlexOperand constructor
  }

  unpack() : [Operation, Condition, boolean, Register, Register, FlexOperand] {
    return [
      this._op,
      this._cond, 
      this._setFlags,
      this._Rd,
      this._Rn,
      this._flex
    ];
  }

  /**
   * TODO: implement for explanation section
   */
  assemble() {}
}