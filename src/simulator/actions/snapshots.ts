import { data } from "../data";
import { TSimulatorSnapshot } from "../types";
import clone  from 'lodash.clonedeep';

export const snapshots = {
  takeSnapshot: function () {
		
    const snapshot: TSimulatorSnapshot = {
      cpu: clone(data.cpu),
      memory: clone(data.memory),

      running: data.running,
      previousPC: data.previousPC,
      currentInstruction: data.currentInstruction,
      wasExecuted: data.wasExecuted,

      output: clone(data.output),
      exitStatus: clone(data.exitStatus)
    };

		console.log("snapshot:", snapshot);

    // enqueue snapshot or replace if snapshot at that tick already exists
    data.snapshots.enqueue(snapshot, (existingSnapshot) => existingSnapshot.cpu.tick === snapshot.cpu.tick );
  },

  reinstateSnapshot: function (tick: number) {
    const state = data.snapshots.data().find(e => e.cpu.tick === tick);
    if (!state) throw Error;

    data.cpu = clone(state.cpu);
    data.memory = clone(state.memory);

    data.running = state.running;
    data.paused = true;

    data.previousPC = state.previousPC;
    data.currentInstruction = state.currentInstruction;
    data.wasExecuted = state.wasExecuted;

    data.output = clone(state.output);
    data.exitStatus = clone(state.exitStatus);
  },
}