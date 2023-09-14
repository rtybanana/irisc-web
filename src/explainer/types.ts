import { Flag, Register } from "@/constants";

export type TByteRange = {
    base: number ;
    limit: number;
}

export type TSnapshotExplanation = {
    key: number;
    
    tick: number;
    instruction: string;

    registers: number[]
    flags: boolean[],

    registersHit: Map<Register, number>;
    flagsHit: Map<Flag, boolean>;

    memRead: TByteRange | undefined;
    memWrite: TByteRange | undefined;

    explanation: string;
}