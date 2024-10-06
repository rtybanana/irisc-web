export enum DataType {
  BYTE, HWORD, WORD
}

export const dataTypeMap: Record<string, DataType> = {
  '.byte': DataType.BYTE,
  '.hword': DataType.HWORD,
  '.word': DataType.WORD,
  '.asciz': DataType.BYTE,
  '.skip': DataType.BYTE
}

export const dataTypeBitSizeMap = {
  [DataType.BYTE]: 8,
  [DataType.HWORD]: 16,
  [DataType.WORD]: 32
} as const;

export const dataTypeBufferConstructorMap = {
  [DataType.BYTE]: Uint8Array,
  [DataType.HWORD]: Uint16Array,
  [DataType.WORD]: Uint32Array
} as const;