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

export type TSnapshotExplanation = {
	key: number;
	tick: number;
	instruction: string;

	difference: TSnapshotDifference;
}