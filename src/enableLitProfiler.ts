import { patchLifecycle } from './patches/patchLifecycle';
import { wrapProperties } from './patches/wrapProperties';

export interface ProfilerOptions {
  logToConsole?: boolean;
  emitEvents?: boolean;
  autoLabelComponents?: boolean;
  trackProperties?: boolean;
}

export function enableLitProfiler(options: ProfilerOptions = {}): void {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[lit-profiler] Warning: Profiler is enabled in production!');
  }

  const opts = {
    logToConsole: false,
    emitEvents: false,
    autoLabelComponents: false,
    trackProperties: false,
    ...options,
  };
  patchLifecycle({
    logToConsole: opts.logToConsole,
    emitEvents: opts.emitEvents,
    autoLabel: opts.autoLabelComponents,
    trackProperties: opts.trackProperties,
  });
  if (opts.trackProperties) {
    wrapProperties();
  }
}
