import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { FlexOperand } from '../FlexOperand';
import { Register, Operation, Condition, opMap, condMap, condTitle, condExplain, opTitle, opExplain, flagExplain, regTitle, setFlagsExplain, shiftTitle } from '@/constants';
import { AssemblyError, SyntaxError } from '../../interpreter/error';
import { TAssembled, IExplanation } from '../types';
import { deflex } from '../../interpreter/interpreter';
import { bitset } from '@/assets/bitset';


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
    let explanation: IExplanation[] = [];
  
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

    let immBit = +this._flex.isImm;          // unary operator (1 if boolean is true)
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
      detail: "These bits are left unset because the instruction only has two operands.", 
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

    // const [Rm, shift, Rs, immShift] = this._flex.unpack();
    // if (this._flex.isImm) {                                                                          // operand is immediate
    //   instruction = (instruction << 4) | immShift;
    //   explanation.push({
    //     title: "Barrel Shifter", 
    //     subtitle: (immShift == 0 ? "Not Shifted" : `Rotated right by ${immShift}`), 
    //     detail: "The amount by which the eight bit immediate value is rotated right.", 
    //     range: 4
    //   });

    //   instruction = (instruction << 8) | Rm;
    //   explanation.push({
    //     title: "Immediate", 
    //     subtitle: `Value ${Rm}`, 
    //     detail: "An eight bit immediate value. This value, along with the barrel shift, forms the second operand.", 
    //     range: 8
    //   });
    // }
    // else if (this._flex.isReg) {                                                                     // operand is register
    //   if (this._flex.shifted) {                                                                      // operand is optionally shifted
    //     if (this._flex.shiftedByReg) {                                                               // shifted by register
    //       instruction = (instruction << 4) | Rs!;
    //       explanation.push({
    //         title: "Optional Shift Amount", 
    //         subtitle: regTitle[Rs as Register], 
    //         detail: "Shift the flexible operand by the value in " + regTitle[Rs as Register] + ".", 
    //         range: 4
    //       });
  
    //       instruction = (instruction << 3) | shift!;                                             // 3 because extra 0 of unused space for registers
    //       explanation.push({
    //         title: "Optional Shift Operation", 
    //         subtitle: shiftTitle[shift!], 
    //         detail: "The type of shift to perform on the flexible operand.", 
    //         range: 3
    //       });
  
    //       instruction = (instruction << 1) | 1;
    //       explanation.push({
    //         title: "Optional Shift Type", 
    //         subtitle: "Register", 
    //         detail: "The flexible operand is optionally shifted by a register value.", 
    //         range: 1
    //       });
    //     }
    //     else if (this._flex.shiftedByImm) {                                                          // shifted by immediate
    //       instruction = (instruction << 5) | Rs!;
    //       explanation.push({
    //         title: "Optional Shift Amount", 
    //         subtitle: `Immediate ${Rs}`, 
    //         detail: `Shift by the provided five bit immediate value (${Rs}).`, 
    //         range: 5
    //       });
  
    //       instruction = ((instruction << 2) | shift!) << 1;
    //       explanation.push({
    //         title: "Optional Shift Operation", 
    //         subtitle: shiftTitle[shift!], 
    //         detail: "The type of shift to perform on the flexible operand.", 
    //         range: 2
    //       });

    //       explanation.push({
    //         title: "Optional Shift Type", 
    //         subtitle: "Immediate", 
    //         detail: "The flexible operand is optionally shifted by an immediate value.", 
    //         range: 1
    //       });
    //     }
    //     else throw new AssemblyError("Optional shift operand Rs is neither a REGISTER nor IMMEDIATE value. Most likely a parser bug.", this._statement, this._lineNumber, -1);
    //   }
    //   else {                                                                                      // operand is not optionally shifted
    //     instruction <<= 8;
    //     explanation.push({
    //       title: "No Optional Shift", 
    //       subtitle: "N/A", 
    //       detail: "The flexible operand is not optionally shifted.", 
    //       range: 8
    //     });
    //   }
  
    //   instruction = (instruction << 4) | Rm;
    //   explanation.push({
    //     title: "Flexible Operand", 
    //     subtitle: regTitle[Rm as Register], 
    //     detail: ". This operand has special properties in ARMv7. It can be either an immediate value or an optionally shifted register.", 
    //     range: 4
    //   });
    // }
    // else throw new AssemblyError("Source operand Rm is neither a REGISTER nor IMMEDIATE value. This is most likely a parser bug.", this._statement, this._lineNumber, -1);
  
    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }
}