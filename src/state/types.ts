import { IriscError, RuntimeError } from "@/interpreter/error";
import { TInstructionNode } from '@/syntax/types';
import { Queue } from '@/utilities';

type TMemory = {
  size: number;
  sizes: number[];

  buffer: ArrayBuffer | undefined;
  wordView: Uint32Array;
  byteView: Uint8Array;

  dataHeight: number;
  dataMap: Record<string, number>;
  
  text: TInstructionNode[];
  textHeight: number;
  textMap: Record<string, number>;

  stackHeight: number;
}

type TCPU = {
  registers: Uint32Array;
  observableRegisters: number[];
  cpsr: boolean[];
  tick: number;
}

export type TExitStatus = RuntimeError | number;

type TSimulatorStateBase = {
  cpu: TCPU;
  memory: TMemory;

  running: boolean;
  previousPC: number;
  currentInstruction?: TInstructionNode;
  wasExecuted: boolean;

  output: string[];
  exitStatus: TExitStatus | undefined;
}

export type TSimulatorSnapshot = TSimulatorStateBase;

export type TSimulatorState = TSimulatorStateBase & {
  paused: boolean;
  step: boolean;
  delay: number;

  errors: IriscError[];
  breakpoints: TInstructionNode[];
  hoveredError: IriscError | null;

  snapshots: Queue<TSimulatorSnapshot>
}