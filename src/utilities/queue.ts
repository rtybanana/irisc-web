import { TSimulatorSnapshot } from "@/simulator";

interface IQueue<T> {
	enqueue(item: T): void;
	dequeue(): T | undefined;
	size(): number;
}

export class Queue<T> implements IQueue<T> {
	private storage: T[] = [];

	constructor(
		private capacity: number = Infinity,
		private autoRoll: boolean = true
	) { }

	enqueue(item: T, replacementPredicate?: (value: T) => boolean): void {
		if (typeof replacementPredicate === "function") {
			for (let i = 0; i < this.storage.length; i++) {
				if (replacementPredicate(this.storage[i])) {
					this.storage[i] = item;
					return;
				}
			}
		}

		if (this.size() === this.capacity) {
			if (this.autoRoll) this.dequeue();
			else throw Error("Queue has reached max capacity, you cannot add more items");
		}

		this.storage.push(item);
	}

	dequeue(): T | undefined {
		return this.storage.shift();
	}

	size(): number {
		return this.storage.length;
	}

	data(): T[] {
		return this.storage;
	}
}