import { IriscError, RuntimeError } from "@/interpreter/error";
import { TInstructionNode } from '@/syntax/types';
import { Queue } from '@/utilities';

export type TAllocation = {
	size: number;
	allocated: boolean;
}

export type TDeclaration = {
  label: string;
  type: string;
  size: number;
  offset: number;
  lineNumber: number;
  data: Uint8Array;
}

type TMemory = {
  size: number;
  sizes: number[];

  buffer: ArrayBuffer | undefined;
  wordView: Uint32Array;
  byteView: Uint8Array;
  observableWordView: number[];
  observableByteView: number[];

  text: TInstructionNode[];
  textHeight: number;
  textMap: Record<string, number>;

  dataHeight: number;
  dataTable: Record<string, number>;
  dataMap: Map<number, TDeclaration>;
  
  heapMap: Map<number, TAllocation>;
  heapHeight: number;
  hasNop: boolean;

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

  stdin?: string;
  output: string[];
  exitStatus: TExitStatus | undefined;
}

export type TSimulatorSnapshot = TSimulatorStateBase & { key: number; };

export type TSimulatorState = TSimulatorStateBase & {
  paused: boolean;
  step: boolean;
  delay: number;

  errors: IriscError[];
  breakpoints: TInstructionNode[];
  hoveredError: IriscError | null;

  interrupted: boolean;

  snapshots: Queue<TSimulatorSnapshot>;
  vue: Vue | undefined;

  systemState: SystemState
}

export enum SystemState {
  OK,
  CRASHING,
  BLUESCREEN,
  BIOS,
  BOOTING
}