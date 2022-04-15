import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { FlexOperand } from '../FlexOperand';
import { Register, Operation, Condition, opMap, condMap, TTransfer, transferMap, TTransferSize, BlockAddressMode } from '@/constants';
import { TBranchAddress } from '../types';
import { SyntaxError, ReferenceError } from '@/classes/error';
import { TransferNode } from './TransferNode';


/** Class which holds all the information required to execute a bi-operand instruction */
// export class BlockTransferNode extends TransferNode {
//   protected _op: Transfer;
//   protected _cond: Condition;
//   protected _transferSize: TTransferSize;
//   protected _Rlist: Register[];
//   protected _Rn: Register;
//   protected _addressMode: BlockAddressMode;

//   constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
//     super(statement, lineNumber, currentToken);

//     const [operation, modifier, condition] = this.splitOpCode(this.nextToken());
//     this._op = transferMap[operation];
//     this._transferSize = modifier.length === 0 ? "word" : "byte";
//     this._cond = condMap[condition];
    
//   }

//   parseRegOrLabel() : TBranchAddress {
//     if (this.peekToken().type === "register") return this.parseReg(this.peekToken());
//     else if (this.peekToken().type === "data-label") return (this.peekToken().content as string).slice(1);

//     throw new SyntaxError(`Expected either REGISTER or DATA-LABEL value - received '${this.peekToken().type}' ${this.peekToken().content}' instead.`, this._statement, this._lineNumber, this._currentToken);
//   }
// }