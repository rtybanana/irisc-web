import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { FlexOperand } from '../FlexOperand';
import { Register, Operation, Condition, opMap, condMap, TTransfer, transferMap, TTransferSize, TSign, TAddressMode, SingleTransfer } from '@/constants';
import { TBranchAddress } from '../types';
import { SyntaxError, ReferenceError, IriscError } from '@/classes/error';
import { TransferNode } from './TransferNode';


/** Class which holds all the information required to execute a bi-operand instruction */
export class SingleTransferNode extends TransferNode {
  protected _op: SingleTransfer;
  protected _cond: Condition;
  protected _setFlags: boolean = false;
  protected _transferSize: TTransferSize;
  protected _Rd: Register;
  protected _Rn!: TBranchAddress;
  protected _sign: TSign = "+";
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

    console.log(statement);

    const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
    this._op = transferMap[operation] as SingleTransfer;
    this._transferSize = modifier.length === 0 ? "word" : "byte";
    this._cond = condMap[condition];

    this._Rd = this.parseReg(this.nextToken());
    this.parseComma(this.nextToken());

    this.parseAddressOrLabel();


    // if (this.isLiteral) {
    if (this.hasToken()) {
      throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
    }
    // }
    
  }

  parseAddressOrLabel() {
    console.log("parse address or label");

    if (this.peekToken().type === "data-label") {
      this._Rn = (this.nextToken().content as string).slice(1);
    }
    else if (this.peekToken().type === "indexer") {
      this.parseAddressExpr();
    }

    else throw new SyntaxError(`Expected either ADDRESS EXPRESSION or =LABEL value - received '${this.peekToken().type}' ${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken);
  }

  parseAddressExpr() {
    this.parseIndexer(this.nextToken(), "start");
    this._Rn = this.parseReg(this.nextToken());
    
    try { 
      this.parseIndexer(this.peekToken(), "end");

      this._addressMode = "post"; 
      this._updating = true;
      this.nextToken();
    }
    catch (e) { if (!(e instanceof SyntaxError)) throw e }  // rethrow if not syntax error

    let comma = false;
    try {
      this.parseComma(this.nextToken());
      comma = true;

      this.peekToken();
      if (this.peekToken().type === "sign") {
        let sign = this.nextToken();
        this._sign = sign.content as TSign;
      }
      this._flex = new FlexOperand(this.statement, this.lineNumber, this._currentToken);          // parsing delegated to FlexOperand constructor
      this._currentToken = this._flex.currentToken;
    }
    catch (e) { 
      if (comma) throw e;
      if (!(e instanceof SyntaxError)) throw e;
    }
    
    if (this._addressMode === "post") {
      if (this.hasToken()) {
        throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
      }
      return;
    }

    this.parseIndexer(this.nextToken(), "end");
    this._addressMode = "pre";
    
    if (this.hasToken()) {
      if (this.peekToken().type === "updating") {
        this._updating = true;
      }
      else throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken);
    
      this.nextToken();
    }
  }

  parseIndexer(token: Token, alias: string) {
    if (token.type !== "indexer" || token.alias !== alias) {
      throw new SyntaxError(`Expected '[' to begin addressing syntax - received '${token.content}' instead.`, this.statement, this.lineNumber, this._currentToken);
    }
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