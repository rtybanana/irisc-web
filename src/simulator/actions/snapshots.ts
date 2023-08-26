import { state } from "../state";
import { TSimulatorSnapshot } from "../types";
import clone  from 'lodash.clonedeep';

export const snapshots = {
  takeSnapshot: function () {
		
    const snapshot: TSimulatorSnapshot = {
      cpu: clone(state.cpu),
      memory: clone(state.memory),

      running: state.running,
      previousPC: state.previousPC,
      currentInstruction: state.currentInstruction,
      wasExecuted: state.wasExecuted,

      output: clone(state.output),
      exitStatus: clone(state.exitStatus)
    };

		console.log("snapshot:", snapshot);

    // enqueue snapshot or replace if snapshot at that tick already exists
    state.snapshots.enqueue(snapshot, (existingSnapshot) => existingSnapshot.cpu.tick === snapshot.cpu.tick );
  },

  reinstateSnapshot: function (tick: number) {
    const snapshot = state.snapshots.data().find(e => e.cpu.tick === tick);
    if (!snapshot) throw Error;

    state.cpu = clone(snapshot.cpu);
    state.memory = clone(snapshot.memory);

    state.running = snapshot.running;
    state.paused = true;

    state.previousPC = snapshot.previousPC;
    state.currentInstruction = snapshot.currentInstruction;
    state.wasExecuted = snapshot.wasExecuted;

    state.output = clone(snapshot.output);
    state.exitStatus = clone(snapshot.exitStatus);
  },
}