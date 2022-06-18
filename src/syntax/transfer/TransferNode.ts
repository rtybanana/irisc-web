import { Condition, TTransfer } from '@/constants';
import { InstructionNode } from '../InstructionNode';
import { TBranchAddress } from '../types';


/** Class which holds all the information required to execute a bi-operand instruction */
export abstract class TransferNode extends InstructionNode {
  protected abstract _op: TTransfer;
  protected abstract _cond: Condition;
  protected abstract _Rn: TBranchAddress | undefined;
  // protected abstract _addressMode: TAddressMode | undefined;

  protected  _setFlags: boolean = false;
  protected _updating: boolean = false;

  // get transferSize() : TTransferSize { return this._transferSize; }
  get isUpdating() : boolean { return this._updating; }
}