import { describe, it, expect } from 'vitest';
import { deepDiff } from '../src/utils/deepDiff';

describe('deepDiff', () => {
  it('detects changed values at root and nested levels', () => {
    const a = { foo: 1, nested: { bar: 2 } };
    const b = { foo: 2, nested: { bar: 3 } };
    const diff = deepDiff(a, b);
    expect(diff.changed).toEqual({ 'foo': 2, 'nested.bar': 3 });
    expect(diff.added).toEqual({});
    expect(diff.removed).toEqual({});
  });

  it('detects added and removed properties', () => {
    const a = { keep: true, removeMe: 1 };
    const b = { keep: true, addMe: 2 };
    const diff = deepDiff(a, b);
    expect(diff.changed).toEqual({});
    expect(diff.added).toEqual({ 'addMe': 2 });
    expect(diff.removed).toEqual({ 'removeMe': 1 });
  });

  it('handles edge cases with non objects and nulls', () => {
    const diff1 = deepDiff(null, { a: 1 });
    expect(diff1.added).toEqual({ 'a': 1 });

    const obj = { a: 1 };
    const diff2 = deepDiff(obj, obj);
    expect(diff2).toEqual({ changed: {}, added: {}, removed: {} });
  });
});
