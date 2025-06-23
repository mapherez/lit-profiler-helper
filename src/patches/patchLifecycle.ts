import { emitDebug } from '../debug/emitDebugEvents';
import { registerComponent } from '../metadata/registerComponent';
import { LitElement } from 'lit';
import { deepDiff } from '../utils/deepDiff';
import { throttle } from '../utils/throttle';

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

  const componentUpdateMap = new WeakMap<any, any>();
  const throttleMap = new WeakMap<any, (detail: any) => void>();

  const originalUpdate = proto.update;
  proto.update = function (changedProperties: Map<string, unknown>) {
    const id = registerComponent(this, opts.autoLabel);
    const start = performance.now();
    const result = originalUpdate.call(this, changedProperties);
    const duration = performance.now() - start;

    let props: any = undefined;
    let diff: any = undefined;

    if (opts.trackProperties) {
      const prevProps = componentUpdateMap.get(this) || {};
      props = { ...this };
      diff = deepDiff(prevProps, props);
      componentUpdateMap.set(this, JSON.parse(JSON.stringify(props)));
    }

    let emit = throttleMap.get(this);
    if (!emit) {
      emit = throttle((detail: any) => {
        emitDebug({ type: 'render', detail }, opts.logToConsole, opts.emitEvents);
      }, 300, { trailing: true });
      throttleMap.set(this, emit);
    }

    emit({ id, duration, props, propDiff: diff });

    return result;
  };
}
