import { TSimulatorSnapshot } from "@/simulator/types";
import { TByteRange, TSnapshotExplanation, TSnapshotDifference } from "./types";
import { Flag, Register } from "@/constants";
import { highlight, languages } from "prismjs";
import { zip } from "@/assets/functions";
import { SimulatorState } from "@/simulator";
import { TransferNode } from "@/syntax";

export function explain(snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
	const difference = getDifference(snapshot, prevSnapshot);
	
	return {
		key: snapshot.key,
		
		tick: snapshot.cpu.tick,
		instruction: snapshot.currentInstruction
			? highlight(snapshot.currentInstruction.text, languages.armv7, 'ARMv7')
			: "Base State",
		
		difference
	}
}

function getDifference(snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotDifference {
	const explanation = {
		registers: snapshot.cpu.observableRegisters,
		flags: snapshot.cpu.cpsr,

		registersHit: new Map<Register, number>(),
		flagsHit: new Map<Flag, boolean>(),
	} as TSnapshotDifference;

	if (prevSnapshot) {
		// determine which registers were hit
		explanation.registersHit = zip(snapshot.cpu.observableRegisters, prevSnapshot.cpu.observableRegisters)
			.reduce((hitSet, [newReg, oldReg], index) => {
				if (newReg !== oldReg) hitSet.set(index, oldReg);
				return hitSet;
			}, new Map<Register, number>());

		// determine which flags where hit
		explanation.flagsHit = zip(snapshot.cpu.cpsr, prevSnapshot.cpu.cpsr)
			.reduce((hitSet, [newFlag, oldFlag], index) => {
				if (newFlag !== oldFlag) hitSet.set(index, oldFlag);
				return hitSet;
			}, new Map<Flag, boolean>());


		// discover which range of memory was accessed
		if (snapshot.wasExecuted && snapshot.currentInstruction instanceof TransferNode) {
			const range = SimulatorState.getMemoryAccessRange(snapshot.currentInstruction, prevSnapshot);
			if (snapshot.currentInstruction.isRead) {
				explanation.memRead = range;
			}
			else {
				explanation.memWrite = range;
			}
		}
		else {
			const prevMem = Array.from(prevSnapshot.memory.byteView);
			const mem = Array.from(snapshot.memory.byteView);

			explanation.memWrite = zip(mem, prevMem)
				.reduce((range, [newByte, oldByte], index) => {
					if (newByte !== oldByte) {
						if (!range) range = { base: index, limit: index }
						else range.limit = index;
					}

					return range;
				}, undefined as TByteRange | undefined);

			
		}
	}

	return explanation;
}