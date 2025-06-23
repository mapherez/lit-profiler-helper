import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from '../src/utils/throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('throttles function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // trailing not enabled
  });

  it('supports leading and trailing options', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { trailing: true });
    throttled('a');
    throttled('b');
    expect(fn).toHaveBeenCalledTimes(1); // leading call
    expect(fn).toHaveBeenCalledWith('a');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2); // trailing call
    expect(fn).toHaveBeenLastCalledWith('b');
  });

  it('preserves context and arguments', () => {
    const ctx = { value: 0, inc(this: any, v: number) { this.value += v; } };
    const throttled = throttle(ctx.inc, 100, { trailing: true });
    throttled.call(ctx, 1);
    throttled.call(ctx, 2);
    vi.advanceTimersByTime(100);
    expect(ctx.value).toBe(3);
  });
});
