import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { FlexOperand } from '../FlexOperand';
import { Register, Operation, Condition, opMap, condMap, TTransfer, transferMap, TTransferSize, TSign, TAddressMode, SingleTransfer } from '@/constants';
import { TBranchAddress } from '../types';
import { SyntaxError, ReferenceError } from '@/classes/error';
import { TransferNode } from './TransferNode';


/** Class which holds all the information required to execute a bi-operand instruction */
export class SingleTransferNode extends TransferNode {
  protected _op: SingleTransfer;
  protected _cond: Condition;
  protected _setFlags: boolean = false;
  protected _transferSize: TTransferSize;
  protected _Rd: Register;
  protected _Rn: TBranchAddress;
  protected _sign: TSign | undefined;
  protected _flex: FlexOperand | undefined;
  protected _addressMode: TAddressMode | undefined;
  protected _updating: boolean = false;

  get isReg() : boolean { return typeof this._Rn === 'number'; }
  get isLiteral() : boolean { return typeof this._Rn === 'string'; }
  get literal() : string { 
    if (!this.isLiteral) throw new ReferenceError("Tried to access reference where there was none. Contact the developer.", this.statement, this.lineNumber, -1);
    return this._Rn as string;
  }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
    this._op = transferMap[operation] as SingleTransfer;
    this._transferSize = modifier.length === 0 ? "word" : "byte";
    this._cond = condMap[condition];

    this._Rd = this.parseReg(this.nextToken());
    this.parseComma(this.nextToken());

    this._Rn = this.parseRegOrLabel();

    this.nextToken();

    if (this.isLiteral) {
      if (this.hasToken()) {
        throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
      }
    }
    
  }

  parseRegOrLabel() : TBranchAddress {
    if (this.peekToken().type === "register") return this.parseReg(this.peekToken());
    else if (this.peekToken().type === "data-label") return (this.peekToken().content as string).slice(1);

    throw new SyntaxError(`Expected either REGISTER or DATA-LABEL value - received '${this.peekToken().type}' ${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken);
  }

  unpack() : [SingleTransfer, Condition, TTransferSize, Register, TBranchAddress, TSign | undefined, FlexOperand | undefined, TAddressMode | undefined, boolean] {
    return [
      this._op,
      this._cond,
      this._transferSize,
      this._Rd, 
      this._Rn,
      this._sign,
      this._flex,
      this._addressMode,
      this._updating
    ]
  }
}