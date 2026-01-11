// import decimal from "dec-to-binary";

/** Find first set (ffs)
 * Returns the zero-indexed position of the least significant, set bit
 * 
 * @param n number to find the first set bit for
 * @returns a zero-indexed number representing the position of the first set bit
 */
export function ffs(n: number) : number {
  n = (0xffffffff & n) >>> 0;
  return Math.log2(n & -n);
}

/** Find last set (fls)
 * Returns the zero-indexed position of the most significant, set bit
 * 
 * @param n number to find the last set bit for
 * @returns a zero-indexed number representing the position of the last set bit
 */
export function fls(n: number) : number {
  n = (0xffffffff & n) >>> 0;
  return Math.floor(Math.log2(n));
}

/** Rotate right (rotr)
 * Performs the rotate right operation on $n by $d
 * 
 * @param n the number to rotate
 * @param d the number to rotate by
 * @returns the rotated value
 */
export function rotr(n: number, d: number) : number {
  return (n >>> d)|(n << (32 - d));
}

/**
 * 
 * @param n 
 * @returns 
 */
export function bitset(size: number, value: number | bigint = 0) : number[] {
  const binary = get64binary(value);
  return binary.substring(64 - size).split('').map(e => parseInt(e, 10)).reverse();
}

function get64binary(int: number | bigint) {
  if (int>=0) {
    const binary = int.toString(2);
    return binary.padStart(64, "0");     // pad to width 64 with leading 0s
  }
  
  return (-BigInt(int)-1n)
    .toString(2)
    .replace(/[01]/g, function(d: string) : string { return (+!+d).toString(); }) // hehe: inverts each char
    .padStart(64, "1");
}