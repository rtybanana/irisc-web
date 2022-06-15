import { TInstructionNode } from '@/classes/syntax/types';
import { IriscError, RuntimeError } from "@/classes/error";

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
export type TEmulatorState = {
  running: boolean;
  paused: boolean;
  step: boolean;
  delay: number;

  cpu: TCPU;
  memory: TMemory;

  // previousPC: number;
  currentInstruction?: TInstructionNode;
  wasExecuted: boolean;

  errors: IriscError[];
  hoveredError: IriscError | null;
  exitStatus: TExitStatus | undefined;
}