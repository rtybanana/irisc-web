import { bitset } from "@/assets/bitset";
import { condExplain, Condition, condMap, condTitle, Operation, opMap, Register, regTitle } from "@/constants";
import { Interpreter, SyntaxError } from "@/interpreter";
import { Token } from "prismjs";
import { InstructionNode } from "../InstructionNode";
import { IExplanation, TAssembled, TBranchAddress } from "../types";
import { branchRegex } from "@/assets";

export class BranchNode extends InstructionNode {
  protected _op: Operation;
  protected _cond: Condition;
  protected _setFlags: boolean;
  protected _Rd: TBranchAddress;
  private readonly _regex: RegExp = branchRegex;

  get Rd() : TBranchAddress { return this._Rd; }

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

  protected splitOpCode(token: Token): [string, string, string] {
    let operation: string = "";
    const modifier: string = "";
    let condition: string = "";

    const matches = this._regex.exec(token.content as string)!;
    operation = matches[1];
    condition = matches[2] ?? "";

    return [operation, modifier, condition];
  }

  unpack(): [Operation, Condition, TBranchAddress] {
    return [
      this._op,
      this._cond,
      this._Rd
    ]
  }

  /**
   * 
   */
  assemble(): TAssembled {
    if (this._op === Operation.BX) return this.assembleBX();

    let instruction: number = 0;
    const explanation: IExplanation[] = [];

    instruction = (instruction << 4) | this._cond;
    explanation.push({
      title: "Condition Code", 
      subtitle: condTitle[this._cond], 
      detail: condExplain[this._cond], 
      range: 4
    });

    instruction = (instruction << 3) | 5;
    explanation.push({
      title: "Instruction Type", 
      subtitle: "Branch", 
      detail: "Indicates the organisation of bits to the processor so that the instruction can be decoded.", 
      range: 3
    });
    
    const linkBit = this._op === Operation.BL ? 1 : 0;
    instruction = (instruction << 1) | linkBit;
    explanation.push({
      title: "Link Bit", 
      subtitle: linkBit ? "Link" : "Do not link", 
      detail: "Tells the processor to set the link register to the instruction after the branch so that it can be returned to.", 
      range: 1
    });

    const labelOffset = Interpreter.generateLabelOffset(this._Rd as string, this);

    instruction = (instruction << 24) | (labelOffset & 16777215);
    explanation.push({
      title: "Offset", 
      subtitle: `Value ${labelOffset}`, 
      // TODO: add html functionality to description to add link
      detail: "A 24 bit encoding of the offset from the current PC to the label address. This actually works a little differently in real processors, but this is the gist.", 
      range: 24
    });

    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }

  assembleBX(): TAssembled {
    let instruction: number = 0;
    const explanation: IExplanation[] = [];

    instruction = (instruction << 4) | this._cond;
    explanation.push({
      title: "Condition Code", 
      subtitle: condTitle[this._cond], 
      detail: condExplain[this._cond], 
      range: 4
    });

    // push instruction signature 000100101111111111110001 into the bitcode
    instruction = (instruction << 24) | 1245169;
    explanation.push({
      title: "Instruction Type", 
      subtitle: "Branch and exchange", 
      detail: "Indicates the organisation of bits to the processor so that the instruction can be decoded.", 
      range: 24
    });

    instruction = (instruction << 4) | this._Rd as Register;
    explanation.push({
      title: "First Operand", 
      subtitle: regTitle[this._Rd as Register], 
      detail: "The first operand contains the address to which the processor should branch.", 
      range: 4
    });

    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }
}