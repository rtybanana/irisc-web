/** Find first set (ffs)
 * Returns the zero-indexed position of the least significant, set bit
 * 
 * @param n number to find the first set bit for
 * @returns a zero-indexed number representing the position of the first set bit
 */
export function ffs(n: number) : number {
  return Math.log2(n & -n);
}

/** Find last set (fls)
 * Returns the zero-indexed position of the most significant, set bit
 * 
 * @param n number to find the last set bit for
 * @returns a zero-indexed number representing the position of the last set bit
 */
export function fls(n: number) : number {
  return Math.log2(n);
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