export function printf(format: string, ...args: any[]): string;
export function printf(writeStream: NodeJS.WritableStream, format: string, ...args: any[]): void;
export function getTokens(format: string): any[];

// export function getArrayLength(arr: any[]): number;
// export const maxInterval: 12;