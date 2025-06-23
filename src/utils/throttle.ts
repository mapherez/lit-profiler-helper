export function throttle<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let timer: number | undefined;
  return function(this: unknown, ...args: Parameters<T>) {
    if (timer === undefined) {
      timer = window.setTimeout(() => {
        timer = undefined;
      }, wait);
      fn.apply(this, args);
    }
  } as T;
}
