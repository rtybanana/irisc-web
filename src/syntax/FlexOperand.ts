import { Token } from 'prismjs';
import { SyntaxNode } from "./SyntaxNode";
import { AssemblyError, SyntaxError } from '../interpreter/error';
import { Register, Operation, Condition, Shift, regMap, opMap, condMap, shiftMap, OperandType, regTitle, shiftTitle } from '@/constants';
import { bitset, ffs, fls, rotr } from '@/assets/bitset';
import { IExplanation, TAssembled, TRegOrImm } from './types';

export class FlexOperand extends SyntaxNode {
  protected _Rm: TRegOrImm;
  protected _Rs: TRegOrImm | undefined;
  protected _shift: Shift | undefined;
  protected _immShift: number = 0;

  protected _type: OperandType | undefined;
  protected _shiftType: OperandType | undefined;

  get isReg() { return this._type === OperandType.REGISTER; }
  get isImm() { return this._type === OperandType.IMMEDIATE; }
  get shifted() { return this._Rs !== undefined; }
  get shiftedByReg() { return this._shiftType === OperandType.REGISTER; }
  get shiftedByImm() { return this._shiftType === OperandType.IMMEDIATE; }
  get shift() { return this._shift; }
  get immShift() { return this._immShift; }

  /**
   * 
   * @param statement 
   * @param lineNumber 
   * @param currentToken 
   */
  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    // this.parseComma(this.nextToken());
    let [value, type] = this.parseRegOrImm();      // parse immediate with default 8 bits (with extended 4 bit shift)
    this._Rm = value;
    this._type = type;

    if (this.isReg && this.hasToken()) this.parseShift();

    // if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
  }

  /**
   * 
   * @param immBits 
   * @returns 
   */
  parseRegOrImm(immBits: number = 8): [Register | number, OperandType] {
    let flex: Register | number | undefined;
    let type: OperandType | undefined;

    try { 
      flex = this.parseReg(this.peekToken()); 
      type = OperandType.REGISTER
    }
    catch (e) { if (!(e instanceof SyntaxError)) throw e }  // rethrow if not syntax error

    if (flex === undefined) {
      try { 
        if (immBits == 8) {
          const [imm, shift] = this.parseShiftedImm(this.peekToken(), immBits);
          flex = imm;
          this._immShift = shift
        }
        else flex = this.parseImm(this.peekToken(), immBits);

        type = OperandType.IMMEDIATE;
      }
      catch (e) { if (!(e instanceof SyntaxError)) throw e }  // rethrow if not syntax error
    }

    if (flex === undefined || type === undefined) 
      throw new SyntaxError(`Expected either REGISTER or IMMEDIATE value - received ${this.peekToken().type.toUpperCase()} '${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken); 

    this.nextToken();   // advance to the next token as parse attempts only peeked

    return [flex, type];
  }

  /**
   * 
   */
  parseShift() {
    this.parseComma(this.nextToken());
    if (this.peekToken().type === "shift") {
      this._shift = shiftMap[this.nextToken().content as string]
    }
    else throw new SyntaxError(`The comma after the final operand indicates an optional shift, but no shift was found.`, this._statement, this._lineNumber, this._currentToken);
    
    let [value, type] = this.parseRegOrImm(5);     // parse immediate with a max length of 5 bits
    this._Rs = value;
    this._shiftType = type;
  }

  unpack(): [TRegOrImm, Shift | undefined, TRegOrImm | undefined, number] {
    return [ 
      this._Rm, 
      this._shift, 
      this._Rs, 
      this._immShift 
    ];
  }

  assemble(): [number, IExplanation[]] {
    let instruction: number = 0;
    let explanation: IExplanation[] = [];

    const [Rm, shift, Rs, immShift] = this.unpack();
    if (this.isImm) {                                                                          // operand is immediate
      instruction = (instruction << 4) | immShift;
      explanation.push({
        title: "Barrel Shifter", 
        subtitle: (immShift == 0 ? "Not Shifted" : `Rotated Right By ${immShift}`), 
        detail: "The amount by which the eight bit immediate value is rotated right.", 
        range: 4
      });
      
      instruction = (instruction << 8) | Rm;
      explanation.push({
        title: "Immediate", 
        subtitle: `Value ${Rm}`, 
        detail: "An eight bit immediate value. This value, along with the barrel shift, forms the second operand.", 
        range: 8
      });
    }
    else if (this.isReg) {                                                                     // operand is register
      if (this.shifted) {                                                                      // operand is  optionally shifted
        if (this.shiftedByReg) {                                                               // shifted by register
          instruction = (instruction << 4) | Rs!;
          explanation.push({
            title: "Optional Shift Amount", 
            subtitle: regTitle[Rs as Register], 
            detail: "Shift by the value in " + regTitle[Rs as Register] + ".", 
            range: 4
          });

          instruction <<= 1;                                             // 3 because extra 0 of unused space for register shifts
          explanation.push({
            title: "Unused Bit",
            subtitle: "",
            detail: "This bit is left unset because identifying the optional shift register only requires four bits.", 
            range: 1
          });

          instruction = (instruction << 2) | shift!;                                             // 3 because extra 0 of unused space for register shifts
          explanation.push({
            title: "Optional Shift Operation", 
            subtitle: shiftTitle[shift as Shift], 
            detail: "The type of shift to perform on the flexible operand.", 
            range: 2
          });

          instruction = (instruction << 1) | 1;
          explanation.push({
            title: "Optional Shift Type", 
            subtitle: "Register", 
            detail: "The flexible operand is optionally shifted by a register value.", 
            range: 1
          });
        }
        else if (this.shiftedByImm) {                                                          // shifted by immediate
          instruction = (instruction << 5) | Rs!;
          explanation.push({
            title: "Optional Shift Amount", 
            subtitle: `Immediate ${Rs}`, 
            detail: `Shift by the provided five bit immediate value (${Rs}).`, 
            range: 5
          });

          instruction = ((instruction << 2) | shift!) << 1;
          explanation.push({
            title: "Optional Shift Operation", 
            subtitle: shiftTitle[shift as Shift], 
            detail: "The type of shift to perform on the flexible operand.", 
            range: 2
          });

          explanation.push({
            title: "Optional Shift Type", 
            subtitle: "Immediate", 
            detail: "The flexible operand is optionally shifted by an immediate value.", 
            range: 1
          });
        }
        else throw new AssemblyError("Optional shift operand Rs is neither a REGISTER nor IMMEDIATE value. Most likely a parser bug.", this._statement, this._lineNumber, -1);
      }
      else {                                                                                      // operand is not optionally shifted
        instruction <<= 8;
        explanation.push({
          title: "No Optional Shift", 
          subtitle: "N/A", 
          detail: "The flexible operand is not optionally shifted.", 
          range: 8
        });
      }

      instruction = (instruction << 4) | Rm;
      explanation.push({
        title: "Flexible Operand", 
        subtitle: regTitle[Rm as Register], 
        detail: "This operand has special properties in ARMv7. It can be either an immediate value or an optionally shifted register.", 
        range: 4
      });
    }
    else throw new AssemblyError("Source operand Rm is neither a REGISTER nor IMMEDIATE value. This is most likely a parser bug.", this._statement, this._lineNumber, -1);

    return [ instruction, explanation ];
  }
}