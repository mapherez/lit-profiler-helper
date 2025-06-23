import { emitDebug } from '../debug/emitDebugEvents';
import { registerComponent } from '../metadata/registerComponent';
import { LitElement } from 'lit';

export interface PatchOptions {
  logToConsole: boolean;
  emitEvents: boolean;
  autoLabel: boolean;
  trackProperties: boolean;
}

const PATCHED = Symbol('lit-profiler-patched');

export function patchLifecycle(opts: PatchOptions): void {
  const proto = (LitElement as any).prototype as any;
  if (proto[PATCHED]) return;
  proto[PATCHED] = true;

  const originalUpdate = proto.update;
  proto.update = function (changedProperties: Map<string, unknown>) {
    const id = registerComponent(this, opts.autoLabel);
    const start = performance.now();
    const result = originalUpdate.call(this, changedProperties);
    const duration = performance.now() - start;
    const props = opts.trackProperties && changedProperties ? Array.from(changedProperties.keys()) : undefined;
    emitDebug({ type: 'render', detail: { id, duration, props } }, opts.logToConsole, opts.emitEvents);
    return result;
  };
}
