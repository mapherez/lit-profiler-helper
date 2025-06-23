# lit-profiler-helper

A helper library to profile LitElement component rendering.

## Installation
```bash
npm install lit-profiler-helper
```

## Usage
```ts
import { enableLitProfiler } from 'lit-profiler-helper';

enableLitProfiler({ logToConsole: true, emitEvents: true });
```

Optionally pair this library with a Chrome DevTools extension for better visualization.
