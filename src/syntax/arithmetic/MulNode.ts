import { Condition, condMap, Operation, opMap, Register } from "@/constants";
import { InstructionNode } from "../InstructionNode";
import { Token } from "prismjs";
import { SyntaxError } from "@/interpreter";
import { TAssembled } from "../types";

export class MulNode extends InstructionNode {
	protected _op: Operation;
  protected _cond: Condition;
  protected _setFlags: boolean = false;
  protected _Rd: Register;
  protected _Rn: Register;
	protected _Rm: Register;
	protected _Ra?: Register;

	constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
		super(statement, lineNumber, currentToken);

		const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
		this._op = opMap[operation];
		this._setFlags = modifier.length === 0 ? false : true;
		this._cond = condMap[condition];

		this._Rd = this.parseReg(this.nextToken());
		this.parseComma(this.nextToken());

		this._Rn = this.parseReg(this.nextToken());
		
		// special allowed syntax for MUL: "MUL Rd, Rn" where Rd is both operand and destination
		if (this._op === Operation.MUL && !this.hasToken()) {
			this._Rm = this._Rd;
			return;
		}

		this.parseComma(this.nextToken());
		this._Rm = this.parseReg(this.nextToken());

		if (this.hasToken()) this.parseOptionalRa();
		if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
	}

	parseOptionalRa() : void {
		this.parseComma(this.nextToken());
		this._Ra = this.parseReg(this.nextToken());
	}

	unpack() : [Operation, Condition, boolean, Register, Register, Register, Register?] {
		return [
      this._op,
      this._cond, 
      this._setFlags,
      this._Rd,
      this._Rn,
      this._Rm,
			this._Ra
    ];
	}

	assemble() : TAssembled {
		return {
      bitcode: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      explanation: [{
        title: "Unsupported Instruction",
        subtitle: "Cannot assemble this instruction",
        detail: "The assembler is currently work-in-progress. Support for this instruction type is coming soon.",
        range: 32
      }]
    }
	}
}