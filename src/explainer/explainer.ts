import { TSimulatorSnapshot } from "@/simulator/types";
import { TByteRange, TSnapshotDescription, TSnapshotDifference, TSnapshotExplanation } from "./types";
import { Condition, Flag, Operation, Register, callAddress, condDescribe, condNameMap, opExplain } from "@/constants";
import { highlight, languages } from "prismjs";
import { zip } from "@/assets/functions";
import { SimulatorState } from "@/simulator";
import { BiOperandNode, BlockTransferNode, BranchNode, FlexOperand, InstructionNode, ShiftNode, SingleTransferNode, TransferNode, TriOperandNode } from "@/syntax";
import { Interpreter, NotImplementedError } from "@/interpreter";
import { TInstructionNode } from "@/syntax/types";
import { uncapitalize } from "@/utilities";


/////////////////////////////////////////////////////////
// drivers

export function compare(snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotDescription {
	const difference = getDifference(snapshot, prevSnapshot);
	// const explanation = explain(snapshot, prevSnapshot);
	
	return {
		key: snapshot.key,
		
		tick: snapshot.cpu.tick,
		wasExecuted: snapshot.wasExecuted,
		instruction: snapshot.currentInstruction
			? highlight(snapshot.currentInstruction.text, languages.armv7, 'ARMv7')
			: "Base State",
		
		difference,
		explanation: snapshot.explanation
	}
}

function getDifference(snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotDifference {
	const difference = {
		registers: snapshot.cpu.observableRegisters,
		flags: snapshot.cpu.cpsr,

		registersHit: new Map<Register, number>(),
		flagsHit: new Map<Flag, boolean>(),
	} as TSnapshotDifference;

	if (prevSnapshot) {
		// determine which registers were hit
		difference.registersHit = zip(snapshot.cpu.observableRegisters, prevSnapshot.cpu.observableRegisters)
			.reduce((hitSet, [newReg, oldReg], index) => {
				if (newReg !== oldReg) hitSet.set(index, oldReg);
				return hitSet;
			}, new Map<Register, number>());

		// determine which flags where hit
		difference.flagsHit = zip(snapshot.cpu.cpsr, prevSnapshot.cpu.cpsr)
			.reduce((hitSet, [newFlag, oldFlag], index) => {
				if (newFlag !== oldFlag) hitSet.set(index, oldFlag);
				return hitSet;
			}, new Map<Flag, boolean>());


		// discover which range of memory was accessed
		if (snapshot.wasExecuted && snapshot.currentInstruction instanceof TransferNode) {
			const range = SimulatorState.getMemoryAccessRange(snapshot.currentInstruction, prevSnapshot);
			if (snapshot.currentInstruction.isRead) {
				difference.memRead = range;
			}
			else {
				difference.memWrite = range;
			}
		}
		else {
			const prevMem = Array.from(prevSnapshot.memory.byteView);
			const mem = Array.from(snapshot.memory.byteView);

			difference.memWrite = zip(mem, prevMem)
				.reduce((range, [newByte, oldByte], index) => {
					if (newByte !== oldByte) {
						if (!range) range = { base: index, limit: index }
						else range.limit = index;
					}

					return range;
				}, undefined as TByteRange | undefined);

			
		}
	}

	return difference;
}

// function explain(snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation | undefined {
// 	const instruction = snapshot.currentInstruction;
// 	let explanation = {} as TSnapshotExplanation;

// 	try {
// 		if (instruction instanceof BranchNode) explanation = explainBranch(instruction, snapshot, prevSnapshot);

// 		if (instruction instanceof BiOperandNode) explanation = explainBiOperand(instruction, snapshot, prevSnapshot);
// 		if (instruction instanceof TriOperandNode) explanation = explainTriOperand(instruction, snapshot, prevSnapshot);
// 		if (instruction instanceof ShiftNode) explanation = explainShift(instruction, snapshot, prevSnapshot);

// 		if (instruction instanceof SingleTransferNode) explanation = explainSingleTransfer(instruction, snapshot, prevSnapshot);
// 		if (instruction instanceof BlockTransferNode) explanation = explainBlockTransfer(instruction, snapshot, prevSnapshot); 
// 	}
// 	catch (e) {
// 		if (e instanceof NotImplementedError) {
// 			explanation = {
// 				default: "Currently unable to explain this state change. Coming soon."
// 			}
// 		}
// 		else {
// 			explanation = {
// 				default: "An error ocurred while attempting to explain this state change. Please raise an issue on the GitHub."
// 			}
// 		}
// 	}

// 	if (instruction && instruction.cond !== Condition.AL) {
// 		explanation.conditional = explainConditional(instruction as TInstructionNode, snapshot, prevSnapshot);
// 	}

// 	return explanation;
// }


// ///////////////////////////////////////////////////////////
// // specific explainer functions

// /**
//  * 
//  * @param instruction 
//  * @param snapshot 
//  * @param prevSnapshot 
//  * @returns 
//  */
// function explainBranch(instruction: BranchNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	const [op, cond, addr] = instruction.unpack();
// 	const explanation = {} as TSnapshotExplanation;
	
// 	explanation.default = opExplain[instruction.op];

// 	// if external call
// 	if (typeof addr === 'string') {
// 		if (SimulatorState.label(addr as string) === callAddress) {
// 			explanation.supplement = `\
// 				This particular branch instruction is to an external C standard library function <span class="token label">${addr}</span>.\
// 				The contents of the scratch registers (<span class="token register">r0</span>-<span class="token register">r3</span>) are\
// 				<u>not guaranteed</u> to stay the same (<a href="https://community.arm.com/arm-community-blogs/b/architectures-and-processors-blog/posts/on-the-aapcs-with-an-application-to-efficient-parameter-passing" target="_blank">AAPCS</a>).\
// 			`
			
// 			explanation.expression = {
// 				result: `\
// 					The expression given is a <span class="token label">label</span>. The assembler calculates the byte offset between the\
// 					addresses of the branch instruction and the target label (<span class="token label">${addr}</span>). This offset is added\
// 					to the current <span class="token register">pc</span> to give the address of the next instruction.\

// 					<div class="mt-2">\
// 						Since this is a library call and iRISC doesn't actually assemble and link the entire C standard library, this instruction\
// 						doesn't actually branch anywhere and the <span class="token register">pc</span> is simply set to the next instruction.\
// 					</div>\
// 				`
// 			}
// 		}
// 		else {
// 			const labelOffset = Interpreter.generateLabelOffset(addr, instruction) * 4;
// 			const prevPC = prevSnapshot?.cpu.registers[Register.PC];
// 			const result = snapshot.cpu.registers[Register.PC]
// 			explanation.expression = {
// 				result: `\
// 					The expression given is a <span class="token label">label</span>. The assembler calculates the byte offset between the\
// 					addresses of the branch instruction and the target label (<span class="token label">${addr}</span>). This offset\
// 					(<span class="token immediate">${labelOffset}</span>) is added to the current <span class="token register">pc</span>\
// 					(<span class="token immediate">${prevPC}</span>) to give the address of the next instruction: <span class="text-irisc">${result}</span>.`
// 			}
// 		}
// 	}
// 	// else {

// 	// }
	
// 	return explanation;
// }

// function explainBiOperand(instruction: BiOperandNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	throw new NotImplementedError();
// }

// function explainTriOperand(instruction: TriOperandNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	throw new NotImplementedError();
// }

// function explainShift(instruction: ShiftNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	throw new NotImplementedError();
// }

// function explainSingleTransfer(instruction: SingleTransferNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	throw new NotImplementedError();
// }

// function explainBlockTransfer(instruction: BlockTransferNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): TSnapshotExplanation {
// 	throw new NotImplementedError();
// }

// function explainConditional(instruction: InstructionNode, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): string {
// 	const conditional = `\
// 		The condition suffix <span class="token operation">${condNameMap[instruction.cond]}</span>\
// 		indicates that ${uncapitalize(condDescribe[instruction.cond])}\
// 	`;

// 	const cpsr = printCPSR(prevSnapshot!);
// 	const status = snapshot.wasExecuted 
// 		? `<span class="ml-3 executed">Executed</span>`
// 		:	`<span class="ml-3 not-executed">Not Executed</span>`

// 	return conditional + cpsr + status;
// }


// ///////////////////////////////////////////////////////////
// // helper functions

// function explainFlex(flex: FlexOperand, snapshot: TSimulatorSnapshot, prevSnapshot: TSimulatorSnapshot | undefined): string {
// 	throw new NotImplementedError();
// }

// function printCPSR(snapshot: TSimulatorSnapshot): string {
// 	return `
// 		<div class="mt-2 ml-3">\
// 			<span class="text-irisc">cpsr</span>:\
// 			<sup class="px-1">n</sup>${+snapshot.cpu.cpsr[0]} \
// 			<sup class="px-1">z</sup>${+snapshot.cpu.cpsr[1]} \
// 			<sup class="px-1">c</sup>${+snapshot.cpu.cpsr[2]} \
// 			<sup class="px-1">v</sup>${+snapshot.cpu.cpsr[3]} \
// 		</div>\
// 	`;
// }