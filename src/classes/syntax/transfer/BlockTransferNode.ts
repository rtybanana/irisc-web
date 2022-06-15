import { Token } from 'prismjs';
import { Register, Condition, condMap, transferMap, BlockAddressMode, BlockTransfer, operations, blockTransferOperations, blockAddressModeMap } from '@/constants';
import { SyntaxError } from '@/classes/error';
import { TransferNode } from './TransferNode';
import { TAssembled } from '../types';


/** Class which holds all the information required to execute a bi-operand instruction */
export class BlockTransferNode extends TransferNode {
  protected _op: BlockTransfer;
  protected _cond: Condition;
  protected _addressMode: BlockAddressMode = BlockAddressMode.IA;
  protected _Rn!: Register;
  protected _Rlist: Register[] = [];
  protected _updating: boolean = false;

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    const [operation, condition, addressMode, pushPop] = this.splitBlockOpCode(this.nextToken());
    this._op = transferMap[operation] as BlockTransfer;
    this._cond = condMap[condition];
    this._addressMode = blockAddressModeMap[addressMode];

    if (pushPop) this.parsePushPop();
    else this.parseBaseReg();

    this.parseRegList();

    if (this.hasToken()) {
      throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken);
    }
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  splitBlockOpCode(token: Token) : [string, string, string, boolean] {
    let operation: string = "";
    let addressMode: string = "";
    let condition: string = "";

    let op = blockTransferOperations.find(e => (token.content as string).slice(0, e.length) === e) ?? "";
    let suffix: string = (token.content as string).substring(op.length);

    switch (op) {
      case "push":
        return ["stm", suffix, "db", true];
      case "pop":
        return ["ldm", suffix, "ia", true];
      default:
        operation = op;
    }
    
    if (suffix.length === 4) {
      condition = suffix.substring(0, 2);
      suffix = suffix.substring(2);
    }
    addressMode = suffix;

    return [operation, condition, addressMode, false];
  }

  /**
   * 
   */
  parseBaseReg() : void {
    this._Rn = this.parseReg(this.nextToken());

    if (this.peekToken().type === "updating") {
      this._updating = true;
      this.nextToken();
    }

    this.parseComma(this.nextToken());
  }

  parsePushPop() : void {
    this._Rn = Register.SP;
    this._updating = true;
  }

  /**
   * 
   */
  parseRegList() : void {
    this.parseBrace(this.nextToken(), 'start');

    let subStatement = this._statement.slice(this._currentToken);
    let index = 0;
    for (;;) {
      try {
        this._Rlist.push(this.parseReg(subStatement[index++]));
      }
      catch (e) {
        if (e instanceof SyntaxError) {
          // correct token index and rethrow
          e.tokenIndex += index;
          throw e;
        }
      }

      try {
        this.parseComma(subStatement[index]);
        index++;
      }
      catch (e) {
        if (e instanceof SyntaxError || subStatement[index] === undefined) break;
        throw e;
        
      }
    }

    // sort register list into ascending order
    this._Rlist.sort();
    
    this._currentToken += index;
    this.parseBrace(this.nextToken(), 'end');
  }

  /**
   * 
   * @param token 
   * @param alias 
   */
  parseBrace(token: Token, alias: string) {
    if (token.type !== "reg-list") {
      throw new SyntaxError(`Expected '{' or '}' to bound register list syntax - received '${token.content}' instead.`, this.statement, this.lineNumber, this._currentToken);
    }

    if (token.alias !== alias) {
      throw new SyntaxError(`Incorrect brace orientation - received '${token.content}'.`, this.statement, this.lineNumber, this._currentToken);
    }
  }

  unpack() : [BlockTransfer, Condition, Register, Register[], BlockAddressMode, boolean] {
    return [
      this._op,
      this._cond, 
      this._Rn, 
      this._Rlist, 
      this._addressMode, 
      this._updating
    ]
  }

  /**
   * TODO: implement for explanation section
   */
  // assemble(): TAssembled {

  // }
}