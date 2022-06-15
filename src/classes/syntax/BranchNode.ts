import { Condition, condMap, Operation, opMap, Register } from "@/constants";
import { Token } from "prismjs";
import { InstructionNode } from "./InstructionNode";
import { SyntaxError } from "../error";
import { TAssembled, TBranchAddress } from "./types";


export class BranchNode extends InstructionNode {
  protected _op: Operation;
  protected _cond: Condition;
  protected _setFlags: boolean;
  protected _Rd: TBranchAddress;
  // protected _offset: number;

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
    this._op = opMap[operation];
    this._setFlags = modifier.length === 0 ? false : true;
    this._cond = condMap[condition];

    if (this.peekToken().type === "register") 
      this._Rd = this.parseReg(this.peekToken());

    else if (this.peekToken().type === "op-label") 
      this._Rd = this.peekToken().content as string;

    else throw new SyntaxError(`Expected either REGISTER or LABEL value - received '${this.peekToken().type}' ${this.peekToken().content}' instead.`, statement, lineNumber, currentToken);

    this.nextToken();
    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, statement, lineNumber, currentToken + 1);
  }

  unpack() : [Operation, Condition, TBranchAddress] {
    return [
      this._op,
      this._cond,
      this._Rd
    ]
  }

  // assemble(): TAssembled {

  // }
}