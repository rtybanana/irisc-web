import { RuntimeError } from "@/interpreter";
import { state } from "../../state";
import Vue from 'vue';
import { TInstructionNode } from "@/syntax/types";
import { Register, TTransferSize, addressModeGroup } from "@/constants";
import { TransferNode, BlockTransferNode, SingleTransferNode } from "@/syntax";
import { TAllocation, TSimulatorSnapshot } from "../../types";
import { getters } from "@/simulator/getters";
import { memory } from ".";

export const heap = {
	malloc: function (size: number): number {
		size = memory.align(size);

		let ptr = findFirstSpace(size);

		// if a free block exists that can hold $size, split the block
		// else allocate to the top of the heap
		if (ptr) {
			ptr = splitBlock(ptr, size);
		}
		else {
			ptr = allocate(getters.heapBase() + state.memory.heapHeight, size);
		}

		return ptr;
	},

	calloc: function (nmemb: number, size: number): number {
		size = memory.align(nmemb * size);

		let ptr = findFirstSpace(size);

		// if a free block exists that can hold $size, split the block
		// else allocate to the top of the heap
		if (ptr) {
			splitBlock(ptr, size);
		}
		else {
			ptr = allocate(getters.heapBase() + state.memory.heapHeight, size);
		}

		// if allocation succeeded, set bytes in allocated range to 0
		if (ptr !== 0) {
			clear(ptr, size);
			memory.observeMemory();
		}

		return ptr;
	},

	/**
	 * TODO: implement
	 * @param ptr 
	 * @param size 
	 * @returns 
	 */
	realloc: function (ptr: number, size: number): number {
		return 0;
	},

	free: function (ptr: number) {
		if (!state.memory.heapMap.has(ptr)) return;

		// set block to freed
		let block = state.memory.heapMap.get(ptr)!;
		state.memory.heapMap.set(ptr, { ...block, allocated: false })

		// TODO:
		// mergeEmptyBlocks()

		this.setHeapHeight();
	},

	setHeapHeight() {
		let top = getters.heapBase();
	
		state.memory.heapMap.forEach((allocation: TAllocation, ptr: number) => {
			// if (!allocation.allocated) return;
			if (top > ptr + allocation.size) return;
			
			top = ptr + allocation.size;
		});
	
		state.memory.heapHeight = top - state.memory.textHeight - state.memory.dataHeight;
		state.memory.heapMap = new Map(state.memory.heapMap)
	}
}


/**************************************************************
 * Helper functions
 */

/**
 * 
 * @param size 
 * @returns 
 */
function findFirstSpace(size: number): number | null {
	let firstPtr: number | null = null;

	// find pointer of first available space that is large enough to hold $size
	for (let [ptr, allocation] of state.memory.heapMap) {
		if (allocation.allocated) continue;
		if (size > allocation.size) continue;

		firstPtr = ptr;
		break;
	}

	return firstPtr;
}

// TODO: implement mergeEmptyBlocks()
function mergeEmptyBlocks() {
	const orderedBlocks = Array.from(state.memory.heapMap)
		.sort(([aPtr, _a], [bPtr, _b]) => {
			return aPtr - bPtr;
		});

	// remove free blocks at the top
	for (const block of orderedBlocks.slice().reverse()) {
		if (block[1].allocated) break;
		state.memory.heapMap.delete(block[0]);
	}

	const groupedEmptyBlocks = orderedBlocks
		.reduce((groups, block, index, blocks) => {
			const lastGroup = groups[groups.length - 1];
			const lastBlock = blocks[index - 1];
  
			if(!lastGroup || (!block[1].allocated && !(lastBlock?.[1].allocated))) {
				groups.push([]);
			} 
			
			if (!block[1].allocated) {
				groups[groups.length - 1].push(block);
			}
			
			return groups; 
		}, [] as [number, TAllocation][][])
		.filter(group => group.length > 1)

	// TODO:
	// finish this
	// 		- merge groups of empty blocks into single empty blocks
	//		- apply changes to heap map
}

function splitBlock(ptr: number, size: number): number {
	let block = state.memory.heapMap.get(ptr)!;
	let leftoverSize = block.size - size;

	// allocate new block
	ptr = allocate(ptr, size);

	// allocate leftover block if there is space remaining
	if (leftoverSize > 0) allocate(ptr + size, leftoverSize, true);

	return ptr;
}

function allocate(ptr: number, size: number, free?: boolean): number {
	// if there is no space - return a null (0)
	if (ptr + size > state.memory.size - state.memory.stackHeight) return 0;

	state.memory.heapMap.set(ptr, { size, allocated: !free });

	// update heap height for simulator
	memory.setHeapHeight();

	return ptr;
}

function clear(ptr: number, size: number) {
	const range = new Array(size).fill(0);
	state.memory.byteView.set(range, ptr);
}