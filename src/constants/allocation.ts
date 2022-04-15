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