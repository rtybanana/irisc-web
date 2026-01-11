import { condExplain, Condition, condMap, condTitle, Operation, opExplain, opMap, opTitle, Register, regTitle, setFlagsExplain } from "@/constants";
import { InstructionNode } from "../InstructionNode";
import { Token } from "prismjs";
import { SyntaxError } from "@/interpreter";
import { IExplanation, TAssembled } from "../types";
import { bitset } from "@/assets/bitset";

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

		// "MLSS" is not supported (mystery) 
		if (this._op === Operation.MLS && this._setFlags === true) {
			throw new SyntaxError(
				`MLSS (CPSR setting variant of MLS) is not supported in ARMv7 syntax - I don't really know why this is, the docs don't explain it.`,
				statement, lineNumber, this.currentToken - 1
			);
		}

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

		if (this._op !== Operation.MUL) {
			this.parseRa();
		}

		if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
	}

	parseRa() : void {
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
		let instruction: number = 0;
		const explanation: IExplanation[] = [];
	
		instruction = (instruction << 4) | this._cond;
		explanation.push({
			title: "Condition Code", 
			subtitle: condTitle[this._cond], 
			detail: condExplain[this._cond], 
			range: 4
		});
	
		instruction <<= 4;
		explanation.push({
			title: "Instruction Type (1)", 
			subtitle: "Multiply Operation", 
			detail: "Structural bits in a set pattern to indicate the organisation of bits to the processor so that the instruction can be decoded.", 
			range: 4
		});

		instruction = (instruction << 3) | (this._op - 16)
		explanation.push({
			title: "Operation Code",
			subtitle: opTitle[this._op],
			detail: opExplain[this._op],
			range: 3
		});

		const setFlagsBit = +this._setFlags;    // unary operator to convert to 0 | 1
		instruction = (instruction << 1) | setFlagsBit;  
		explanation.push({
			title: "CPSR Flags", 
			subtitle: (this._setFlags ? "Set" : "Not Set"), 
			detail: setFlagsExplain[setFlagsBit],
			range: 1
		});

		instruction = (instruction << 4) | this._Rd;
		explanation.push({
			title: "First Operand (Rd)", 
			subtitle: regTitle[this._Rd], 
			detail: "The first operand is often referred to as the 'destination' register.", 
			range: 4
		});
	
		instruction = (instruction << 4)
		if (this._op === Operation.MUL) {
			explanation.push({
				title: "Accumulation Operand (Ra)", 
				subtitle: "Unused bits", 
				detail: "Used for accumulation variants of MUL (MLA and MLS) but has no purpose for standard MUL.", 
				range: 4
			});
		}
		else {
			instruction |= this._Ra!

			const accumulatedWith = this._op === Operation.MLA ? "added to" : "subtracted from"
			explanation.push({
				title: "Accumulation Operand (Ra)", 
				subtitle: regTitle[this._Ra!],
				detail: `The result of the multiplication between the second and third operands is ${accumulatedWith} the contents of this register to give the final result.`,
				range: 4
			})
		}

		instruction = (instruction << 4) | this._Rm;
		explanation.push({
			title: "Third Operand (Rm)", 
			subtitle: regTitle[this._Rm], 
			detail: "The multiplicand in the operation: Rn x Rm.", 
			range: 4
		});

		instruction = (instruction << 4) | 9;
		explanation.push({
			title: "Instruction Type (2)",
			subtitle: "Multiply Operation",
			detail: "Structural bits in a set pattern to indicate the organisation of bits to the processor so that the instruction can be decoded.",
			range: 4
		});
	
		instruction = (instruction << 4) | this._Rn;
		explanation.push({
			title: "Second Operand (Rn)", 
			subtitle: regTitle[this._Rn], 
			detail: "The multiplier in the operation: Rn x Rm.", 
			range: 4
		});
	
		return {
			bitcode: bitset(32, instruction).reverse(), 
			explanation
		};
	}
}