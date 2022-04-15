import { Token } from 'prismjs';
import { InstructionNode } from '../InstructionNode';
import { FlexOperand } from '../FlexOperand';
import { Register, Operation, Condition, opMap, condMap, TTransfer, transferMap, TTransferSize } from '@/constants';
import { TBranchAddress } from '../types';
import { SyntaxError, ReferenceError } from '@/classes/error';


/** Class which holds all the information required to execute a bi-operand instruction */
export abstract class TransferNode extends InstructionNode {
  protected abstract _op: TTransfer;
  protected abstract _cond: Condition;
  protected abstract _transferSize: TTransferSize;
  protected abstract _Rn: TBranchAddress;
  // protected abstract _addressMode: TAddressMode | undefined;

  protected  _setFlags: boolean = false;
  protected _updating: boolean = false;

  get transferSize() : TTransferSize { return this._transferSize; }
  get isUpdating() : boolean { return this._updating; }
}