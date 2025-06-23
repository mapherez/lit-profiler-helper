# lit-profiler-helper

A helper library to profile LitElement component rendering.

## Installation
```bash
npm install lit-profiler-helper
```

## Usage
```ts
import { enableLitProfiler } from 'lit-profiler-helper';

enableLitProfiler({
  logToConsole: true,
  emitEvents: true,
  trackProperties: true,
});
```

Setting `trackProperties` to `true` will include a deep diff of component
properties in render events for easier inspection.

Optionally pair this library with a Chrome DevTools extension for better visualization.
