import { bitset } from '@/assets/bitset';
import { condExplain, Condition, condMap, condTitle, Register, regTitle, SingleTransfer, TAddressMode, transferMap, TSign, TTransferSize } from '@/constants';
import { Interpreter } from '@/interpreter';
import { ReferenceError, SyntaxError } from '@/interpreter/error';
import { Token } from 'prismjs';
import { FlexOperand } from '../FlexOperand';
import { IExplanation, TAssembled, TBranchAddress } from '../types';
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
  protected _flex!: FlexOperand;
  protected _addressMode: TAddressMode | undefined;
  protected _updating: boolean = false;

  get transferSize() : TTransferSize { return this._transferSize; }
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

    this.parseAddressOrLabel();


    // if (this.isLiteral) {
    if (this.hasToken()) {
      throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid instruction end.`, this._statement, this._lineNumber, this._currentToken + 1);
    }
    // }
    
  }

  parseAddressOrLabel() {
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
    if (token.type !== "indexer") {
      throw new SyntaxError(`Expected '[' or ']' to bound addressing syntax - received '${token.content}' instead.`, this.statement, this.lineNumber, this._currentToken);
    }

    if (token.alias !== alias) {
      throw new SyntaxError(`Incorrect square bracket orientation - received '${token.content}'.`, this.statement, this.lineNumber, this._currentToken);
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

  /**
   * TODO: implement for explanation section
   */
  assemble(): TAssembled {
    let instruction: number = 0;
    let explanation: IExplanation[] = [];
    let labelOffset = this.isLiteral ? Interpreter.generateLabelOffset(this.literal, this) : 0;

    instruction = (instruction << 4) | this._cond;
    explanation.push({
      title: "Condition Code", 
      subtitle: condTitle[this._cond], 
      detail: condExplain[this._cond], 
      range: 4
    });

    instruction = (instruction << 2) | 1;     // push 01 onto the machine code
    explanation.push({
      title: "Instruction Type", 
      subtitle: "Single Transfer", 
      detail: "Indicates the organisation of bits to the processor so that the instruction can be decoded.", 
      range: 2
    });
    
    const immBit = +!(this._flex?.isImm ?? this.isLiteral);        // negated unary operator (0 if boolean is true)
    instruction = (instruction << 1) | immBit;
    explanation.push({
      title: "FlexOperand Type", 
      subtitle: immBit ? "Register" : "Immediate", 
      detail: "Tells the processor if the flexible operand is an immediate value (0) or a register (1).", 
      range: 1
    });

    const addressBit = this._addressMode === "pre" ? 1 : 0;         
    instruction = (instruction << 1) | addressBit;
    explanation.push({
      title: "Pre/Post Indexing Bit", 
      subtitle: addressBit ? "Pre-indexed addressing" : "Post-indexed addressing", 
      detail: "Tells the processor to use pre- (1) or post-index addressing mode for the transfer.", 
      range: 1
    });

    let isUp = this._sign === "+";
    if (this.isLiteral) isUp = labelOffset > 0;

    const upDownBit = +isUp;         
    instruction = (instruction << 1) | upDownBit;
    explanation.push({
      title: "Up/Down Bit", 
      subtitle: upDownBit ? "Up" : "Down", 
      detail: "Tells the processor to add (up, 1) or subtract (down, 0) the offset from the base register.", 
      range: 1
    });
    
    const sizeBit = this._transferSize === "byte" ? 1 : 0;         
    instruction = (instruction << 1) | upDownBit;
    explanation.push({
      title: "Byte/Word Bit", 
      subtitle: sizeBit ? "Byte" : "Word", 
      detail: "Tells the processor to index memory by bytes (1) or words (0).", 
      range: 1
    });

    const writeBackBit = +this._updating;         
    instruction = (instruction << 1) | writeBackBit;
    explanation.push({
      title: "Write-back Bit", 
      subtitle: writeBackBit ? "Updating" : "Not updating", 
      detail: "Tells the processor whether (1) or not (0) to update the base register after transfering the data.", 
      range: 1
    });

    const loadStoreBit = this._op === SingleTransfer.LDR ? 1 : 0;         
    instruction = (instruction << 1) | loadStoreBit;
    explanation.push({
      title: "Load/Store Bit", 
      subtitle: loadStoreBit ? "Load" : "Store", 
      detail: "Tells the processor whether we are loading (1) or storing (0) data from/to memory.", 
      range: 1
    });

    if (this.isReg) {
      instruction = (instruction << 4) | this._Rn as Register;
      explanation.push({
        title: "Second Operand", 
        subtitle: regTitle[this._Rn as Register], 
        detail: "The second operand in a transfer instruction is often referred to as the 'base' register.", 
        range: 4
      });

      instruction = (instruction << 4) | this._Rd;
      explanation.push({
        title: "First Operand", 
        subtitle: regTitle[this._Rd], 
        detail: "The first operand is often referred to as the 'destination' register.", 
        range: 4
      });

      if (this._flex) {
        const [flexInstruction, flexExplanation] = this._flex.assemble();
        instruction = (instruction << 12) | flexInstruction;
        Array.prototype.push.apply(explanation, flexExplanation);
      }
      else  {
        instruction <<= 12;
        explanation.push({
          title: "Flex Operand", 
          subtitle: "No offset", 
          detail: "These bits are left unset because the base address has not been offset in any way.", 
          range: 12
        })
      }
    }
    else {
      instruction = (instruction << 4) | Register.PC;
      explanation.push({
        title: "Second Operand", 
        subtitle: regTitle[Register.PC], 
        detail: "The second operand is often referred to as a 'source' register.", 
        range: 4
      });

      instruction = (instruction << 4) | this._Rd;
      explanation.push({
        title: "First Operand", 
        subtitle: regTitle[this._Rd], 
        detail: "The first operand is often referred to as the 'destination' register.", 
        range: 4
      });

      // TODO: not very robust, needs to be able to generate more complex flexoperand values to
      // reference labels which out of the 255 range.
      // const labelOffset = Interpreter.generateLabelOffset(this);

      // empty barrel shifter - could try to reference more distance addresses 
      instruction = (instruction << 4); 
      explanation.push({
        title: "Barrel Shifter", 
        // subtitle: (immShift == 0 ? "Not Shifted" : `Rotated Right By ${immShift}`), 
        subtitle: "Not shifted",
        detail: "The amount by which the eight bit immediate value is rotated right.", 
        range: 4
      });
      
      instruction = (instruction << 8) | Math.abs(labelOffset);
      explanation.push({
        title: "Immediate", 
        subtitle: `Value ${labelOffset}`, 
        detail: "An eight bit immediate value. This value, along with the barrel shift, forms the second operand.", 
        range: 8
      });
    }


    // TODO: finish implementation
    // instruction <<= 20;

    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }
}