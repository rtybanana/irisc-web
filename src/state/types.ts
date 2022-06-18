import { IriscError, RuntimeError } from "@/interpreter/error";
import { TInstructionNode } from '@/syntax/types';

type TMemory = {
  size: number;
  sizes: number[];

  buffer: ArrayBuffer | undefined;
  wordView: Uint32Array;
  byteView: Uint8Array;

  heapHeight: number;
  heapMap: Record<string, number>;
  
  text: TInstructionNode[];
  textHeight: number;
  textMap: Record<string, number>;

  stackHeight: number;
}

type TCPU = {
  registers: Uint32Array;
  observableRegisters: number[];
  cpsr: boolean[];
}

export type TExitStatus = RuntimeError | number;
export type TSimulatorState = {
  running: boolean;
  paused: boolean;
  step: boolean;
  delay: number;

  cpu: TCPU;
  memory: TMemory;

  previousPC: number;
  currentInstruction?: TInstructionNode;
  wasExecuted: boolean;

  errors: IriscError[];
  hoveredError: IriscError | null;
  exitStatus: TExitStatus | undefined;
}