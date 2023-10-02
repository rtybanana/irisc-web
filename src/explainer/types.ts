import { Flag, Register } from "@/constants";

export type TByteRange = {
	base: number;
	limit: number;
}

export type TSnapshotDifference = {
	registers: number[];
	registersHit: Map<Register, number>;

	flags: boolean[];
	flagsHit: Map<Flag, boolean>;

	memRead: TByteRange | undefined;
	memWrite: TByteRange | undefined;
}

export type TExpressionExplanation = {
	flex?: string;
	result: string;
}

export type TMemoryExplanation = {
	read?: string;
	write?: string;
}

export type TSnapshotExplanation = {
	default: string;												// default explanation for what the operation does
	supplement?: string;										// supplementary information for specific information on this particular instruction
	conditional?: string;										// explanation for why the instruction was skipped if required
	expression?: TExpressionExplanation;		// explanation of operation expression
	memory?: TMemoryExplanation;						// explanation of memory interaction
	flags?: string;													// explanation of flags set
}

export type TSnapshotDescription = {
	key: number;
	tick: number;
	instruction: string;
	wasExecuted: boolean;

	difference: TSnapshotDifference;
	explanation?: TSnapshotExplanation;
}