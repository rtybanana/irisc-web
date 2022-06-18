import { bitset } from '@/assets/bitset';
import { addressModeGroup, BlockAddressMode, blockAddressModeMap, BlockTransfer, blockTransferOperations, condExplain, Condition, condMap, condTitle, Register, regShortTitle, regTitle, transferMap } from '@/constants';
import { SyntaxError } from '@/interpreter/error';
import { Token } from 'prismjs';
import { IExplanation, TAssembled } from '../types';
import { TransferNode } from './TransferNode';


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

    instruction = (instruction << 3) | 4;     // push 01 onto the machine code
    explanation.push({
      title: "Instruction Type", 
      subtitle: "Block Transfer", 
      detail: "Indicates the organisation of bits to the processor so that the instruction can be decoded.", 
      range: 3
    });

    const addressBit = addressModeGroup.before.includes(this._addressMode) ? 1 : 0;   
    instruction = (instruction << 1) | addressBit;
    explanation.push({
      title: "Pre/Post Indexing Bit", 
      subtitle: addressBit ? "Pre-indexed addressing" : "Post-indexed addressing", 
      detail: "Tells the processor to use pre- (1) or post- (0) indexed addressing mode for the transfer.", 
      range: 1
    });

    const upDownBit = addressModeGroup.increment.includes(this._addressMode) ? 1 : 0;         
    instruction = (instruction << 1) | upDownBit;
    explanation.push({
      title: "Up/Down Bit", 
      subtitle: upDownBit ? "Up" : "Down", 
      detail: "Tells the processor to add (up, 1) or subtract (down, 0) the offset from the base register.", 
      range: 1
    });

    const sBit = 0;
    instruction = (instruction << 1) | sBit;
    explanation.push({
      title: "PSR & Force User Bit", 
      subtitle: "Do not load PSR or force user mode", 
      // TODO: add html functionality to description to add link
      detail: "If you would like to learn more about this bit, go to https://iitd-plos.github.io/col718/ref/arm-instructionset.pdf", 
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

    const loadStoreBit = this._op === BlockTransfer.LDM ? 1 : 0;         
    instruction = (instruction << 1) | loadStoreBit;
    explanation.push({
      title: "Load/Store Bit", 
      subtitle: loadStoreBit ? "Load" : "Store", 
      detail: "Tells the processor whether we are loading (1) or storing (0) data from/to memory.", 
      range: 1
    });

    instruction = (instruction << 4) | this._Rn as Register;
    explanation.push({
      title: "First Operand", 
      subtitle: regTitle[this._Rn as Register], 
      detail: "The first operand in a transfer instruction is often referred to as the 'base' register.", 
      range: 4
    });

    const registers = Object.values(Register).filter((v) => !isNaN(Number(v)));
    registers.forEach(reg => {
      const include = this._Rlist.includes(reg as Register) ? 1 : 0;
      instruction = (instruction << 1) | include;
      // explanation.push({
      //   title: "Register List Item", 
      //   subtitle: regTitle[reg as Register], 
      //   detail: `Indicates whether (1) or not (0) ${regTitle[reg as Register]} should be included in the block transfer.`, 
      //   range: 1
      // });
    });

    explanation.push({
      title: "Register List", 
      subtitle: this._Rlist.map(reg => regShortTitle[reg]).join(", "), 
      detail: `This section is made up of 16 bits, each referring to one of the registers r0 -> pc arranged in order from left to right. A set bit indicates that the register should be included in the transfer.`, 
      range: 16
    });

    return {
      bitcode: bitset(32, instruction).reverse(), 
      explanation
    };
  }
}