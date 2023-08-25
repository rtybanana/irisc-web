import { Operation, Register, Shift, TTransfer } from "@/constants";
import { InstructionNode, BiOperandNode, TriOperandNode, BranchNode, TransferNode } from ".";

export type TOperation = Operation | Shift | TTransfer;
export type TRegOrImm = Register | number;
export type TBranchAddress = Register | string;
export type TInstructionNode = InstructionNode | BiOperandNode | TriOperandNode | BranchNode | TransferNode;

export interface IExplanation {
  title: string;
  subtitle: string;
  detail: string;
  range: number;
}

export type TAssembled = {
  bitcode: number[];
  explanation: IExplanation[];
}