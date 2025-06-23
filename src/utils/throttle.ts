export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Throttle calls to `fn` so that it executes at most once every `wait` ms.
 * By default it triggers on the leading edge only but can optionally trigger on
 * the trailing edge of the burst as well.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = false } = options;
  let timer: number | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;

  return function (this: any, ...args: Parameters<T>) {
    if (!timer) {
      if (leading) {
        fn.apply(this, args);
      } else if (trailing) {
        lastArgs = args;
        lastThis = this;
      }
      timer = window.setTimeout(() => {
        timer = undefined;
        if (trailing && lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = undefined;
          lastThis = undefined;
        }
      }, wait);
    } else if (trailing) {
      lastArgs = args;
      lastThis = this;
    }
  };
}
