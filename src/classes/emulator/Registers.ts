

export class Registers {
  private _registers: Uint32Array;
  private _cpsr: boolean[];

  get registers() { return this._registers; }
  get cpsr() : readonly boolean[] { return this._cpsr; }

  constructor() {
    let buffer: ArrayBuffer = new ArrayBuffer(4 * 16);  // 16 * 4 byte length array for cpu registers
    this._registers = new Uint32Array(buffer);

    this._cpsr = [false, false, false, false];
  }
}