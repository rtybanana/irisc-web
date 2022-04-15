import { Operation, Register, Shift, TTransfer } from "@/constants";
import { BiOperandNode } from "./BiOperandNode";
import { BranchNode } from "./BranchNode";
import { InstructionNode } from "./InstructionNode";
import { LabelNode } from "./LabelNode";
import { TriOperandNode } from "./TriOperandNode";

export type TOperation = Operation | Shift | TTransfer;
export type TRegOrImm = Register | number;
export type TBranchAddress = Register | string;
export type TInstructionNode = InstructionNode | BiOperandNode | TriOperandNode | BranchNode;