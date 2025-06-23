export interface DebugEvent {
  type: string;
  detail: any;
}

export function emitDebug(event: DebugEvent, logToConsole: boolean, emitEvents: boolean) {
  const debugObj: any = (window as any).__litProfiler || ((window as any).__litProfiler = { events: [] });
  debugObj.events.push(event);
  if (logToConsole) {
    // eslint-disable-next-line no-console
    console.log('[lit-profiler]', event.type, event.detail);
  }
  if (emitEvents) {
    window.dispatchEvent(new CustomEvent(`lit-profiler:${event.type}`, { detail: event.detail }));
  }
}
