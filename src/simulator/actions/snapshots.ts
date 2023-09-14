import { state } from "../state";
import { TSimulatorSnapshot } from "../types";
import clone  from 'lodash.clonedeep';
import { memory } from "./memory";
import { runner } from "./runner";

export const snapshots = {
  takeSnapshot: function () {
    const snapshot: TSimulatorSnapshot = {
      key: Date.now(),

      cpu: clone(state.cpu),
      memory: clone(state.memory),

      running: state.running,
      previousPC: state.previousPC,
      currentInstruction: state.currentInstruction,
      wasExecuted: state.wasExecuted,

      output: clone(state.output),
      exitStatus: clone(state.exitStatus)
    };

    // enqueue snapshot or replace if snapshot at that tick already exists
    state.snapshots.enqueue(snapshot, (existingSnapshot) => existingSnapshot.cpu.tick === snapshot.cpu.tick );
  },

  reinstateSnapshot: function (tick: number) {
    if (tick < 0) return;

    const snapshot = state.snapshots.data().find(e => e.cpu.tick === tick);
    if (!snapshot) throw Error;

    const wasRunning = state.running;

    state.cpu = clone(snapshot.cpu);

    const buffer = new ArrayBuffer(snapshot.memory.size);
    const byteView = new Uint8Array(buffer);

    byteView.set(snapshot.memory.byteView);
    state.memory = {
      ...clone(snapshot.memory),
      buffer,
      byteView,
      wordView: new Uint32Array(buffer)
    };

    state.running = snapshot.running;
    state.paused = true;

    state.previousPC = snapshot.previousPC;
    state.currentInstruction = snapshot.currentInstruction;
    state.wasExecuted = snapshot.wasExecuted;

    state.output = clone(snapshot.output);
    state.exitStatus = clone(snapshot.exitStatus);

    memory.observeMemory();

    if (snapshot.running && !wasRunning) {
      runner.run(true);
    }
  },
}