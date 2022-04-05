export class uint32 extends Number {
  // private value: number;

  constructor(value: number) {
    super(value)
    // this.value = value;
  }

  valueOf(): number {
    return super.valueOf() & 0xffffffff;
  }
}