// import decimal from "dec-to-binary";

/** Find first set (ffs)
 * Returns the zero-indexed position of the least significant, set bit
 * 
 * @param n number to find the first set bit for
 * @returns a zero-indexed number representing the position of the first set bit
 */
export function ffs(n: number) : number {
  n = 0xffffffff & n;
  return Math.log2(n & -n);
}

/** Find last set (fls)
 * Returns the zero-indexed position of the most significant, set bit
 * 
 * @param n number to find the last set bit for
 * @returns a zero-indexed number representing the position of the last set bit
 */
export function fls(n: number) : number {
  n = 0xffffffff & n;
  return Math.round(Math.log2(n));
}

/** Rotate right (rotr)
 * Performs the rotate right operation on $n by $d
 * 
 * @param n the number to rotate
 * @param d the number to rotate by
 * @returns the rotated value
 */
export function rotr(n: number, d: number) : number {
  return (n >> d)|(n << (32 - d));
}

/**
 * 
 * @param n 
 * @returns 
 */
export function bitset(size: number, value: number = 0) : number[] {
  let binary = get64binary(value);
  return binary.substring(64 - size).split('').map(e => parseInt(e, 10)).reverse();
}

function get64binary(int: number) {
  if (int>=0) return int.toString(2).padStart(64, "0");
  
  return (-int-1)
    .toString(2)
    .replace(/[01]/g, function(d: string) : string { return (+!+d).toString(); }) // hehe: inverts each char
    .padStart(64, "1");
}