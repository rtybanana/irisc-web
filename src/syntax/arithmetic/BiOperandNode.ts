import { bitset } from '@/assets/bitset';
import { condExplain, Condition, condMap, condTitle, Operation, opExplain, opMap, opTitle, Register, regTitle, setFlagsExplain } from '@/constants';
import { Token } from 'prismjs';
import { SyntaxError } from '../../interpreter/error';
import { FlexOperand } from '../FlexOperand';
import { InstructionNode } from '../InstructionNode';
import { IExplanation, TAssembled } from '../types';


/** Class which holds all the information required to execute a bi-operand instruction */
export class BiOperandNode extends InstructionNode {
  protected _op: Operation;
  protected _cond: Condition;
  protected _setFlags: boolean;
  protected _Rd: Register;
  protected _flex: FlexOperand;

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
    this._op = opMap[operation];
    this._setFlags = modifier.length === 0 ? false : true;
    this._cond = condMap[condition];

    this._Rd = this.parseReg(this.nextToken());

    this.parseComma(this.nextToken());

    this.peekToken();                                              // peek next token to see if it exists
    this._flex = new FlexOperand(statement, lineNumber, this._currentToken);          // parsing delegated to FlexOperand constructor
    this._currentToken = this._flex.currentToken;

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
  }

  unpack() : [Operation, Condition, boolean, Register, FlexOperand] {
    return [
      this._op,
      this._cond,
      this._setFlags,
      this._Rd,
      this._flex
    ];
  }

  /**
   * TODO: implement for explanation section
   */
  assemble(): TAssembled {
    let instruction: number = 0;
    const explanation: IExplanation[] = [];
  
    instruction = (instruction << 4) | this._cond;
    explanation.push({
      title: "Condition Code", 
      subtitle: condTitle[this._cond], 
      detail: condExplain[this._cond], 
      range: 4
    });
  
    instruction <<= 2;                // logical shift left 8 for data processing
    explanation.push({
      title: "Instruction Type", 
      subtitle: "Arithmetic Operation", 
      detail: "Indicates the organisation of bits to the processor so that the instruction can be decoded.", 
      range: 2
    });

    const immBit = +this._flex.isImm;          // unary operator (1 if boolean is true)
    instruction = (instruction << 1) | immBit;
    explanation.push({
      title: "FlexOperand Type", 
      subtitle: this._flex.isImm ? "Immediate" : "Register", 
      detail: "Tells the processor if the flexible operand is an immediate value (1) or a register (0).", 
      range: 1
    });
  
    instruction = (instruction << 4) | this._op;
    explanation.push({
      title: "Operation Code", 
      subtitle: opTitle[this._op], 
      detail: opExplain[this._op], 
      range: 4
    });
    
    const setFlagsBit = +this._setFlags;    // unary operator to convert to 0 | 1
    instruction = (instruction << 1) | setFlagsBit;  
    explanation.push({
      title: "CPSR Flags", 
      subtitle: (this._setFlags ? "Set" : "Not Set"), 
      detail: setFlagsExplain[setFlagsBit],
      range: 1
    });
  
    instruction <<= 4;
    explanation.push({
      title: "Second Operand", 
      subtitle: "Unused", 
      detail: "These bits are left unset because the instruction only has two operands. The first, and the flexible operand.", 
      range: 4
    });
  
    instruction = (instruction << 4) | this._Rd;
    explanation.push({
      title: "First Operand", 
      subtitle: regTitle[this._Rd], 
      detail: "The first operand is often referred to as the 'destination' register.", 
      range: 4
    });
    
    const [flexInstruction, flexExplanation] = this._flex.assemble();
    instruction = (instruction << 12) | flexInstruction;
    Array.prototype.push.apply(explanation, flexExplanation);
  
    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }
}