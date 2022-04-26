
/**
 * 
 * @param fn 
 * @param ms 
 * @returns 
 */
export function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export function zip(a: any[], b: any[]) { 
  return a.map((k, i) => [k, b[i]]);
}