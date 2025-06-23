import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/debug/emitDebugEvents', () => ({ emitDebug: vi.fn() }));

let updateSpy: any;
let MockLitElement: any;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  updateSpy = vi.fn(function (this: any) { return 'orig'; });
  MockLitElement = class {
    update(changed?: any) {
      return updateSpy.call(this, changed);
    }
  };
  vi.doMock('lit', () => ({ LitElement: MockLitElement }));
});

declare module 'lit' {
  export class LitElement {}
}

describe('patchLifecycle', () => {
  it('emits debug info with props and diffs when tracking', async () => {
    const { patchLifecycle } = await import('../src/patches/patchLifecycle');
    const { emitDebug } = await import('../src/debug/emitDebugEvents');
    patchLifecycle({ logToConsole: false, emitEvents: false, autoLabel: false, trackProperties: true });
    const el = new MockLitElement();
    (el as any).foo = 1;
    const result = el.update(new Map());
    expect(result).toBe('orig');
    expect(updateSpy).toHaveBeenCalled();
    expect(emitDebug).toHaveBeenCalledWith(
      {
        type: 'render',
        detail: {
          id: expect.any(String),
          duration: expect.any(Number),
          props: { foo: 1 },
          propDiff: {
            changed: {},
            added: { foo: 1 },
            removed: {},
          },
        },
      },
      false,
      false
    );
  });

  it('omits prop tracking when disabled', async () => {
    const { patchLifecycle } = await import('../src/patches/patchLifecycle');
    const { emitDebug } = await import('../src/debug/emitDebugEvents');
    patchLifecycle({ logToConsole: false, emitEvents: false, autoLabel: false, trackProperties: false });
    const el = new MockLitElement();
    const result = el.update(new Map());
    expect(result).toBe('orig');
    expect(emitDebug).toHaveBeenCalledWith(
      {
        type: 'render',
        detail: {
          id: expect.any(String),
          duration: expect.any(Number),
          props: undefined,
          propDiff: undefined,
        },
      },
      false,
      false
    );
  });

  it('preserves original update behavior', async () => {
    const { patchLifecycle } = await import('../src/patches/patchLifecycle');
    patchLifecycle({ logToConsole: false, emitEvents: false, autoLabel: false, trackProperties: false });
    const el = new MockLitElement();
    const patchedUpdate = el.update;
    expect(patchedUpdate).not.toBe(updateSpy); // patched
    const result = el.update(new Map());
    expect(result).toBe('orig');
    expect(updateSpy).toHaveBeenCalled();
  });
});
