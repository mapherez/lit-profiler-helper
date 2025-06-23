# lit-profiler-helper

A lightweight instrumentation helper for Lit (v2 & v3), made to work in pair with a custom Chrome DevTools extension — similar to React Profiler.

It monkey-patches key Lit lifecycle methods to emit structured debug events through `window.__litProfiler`, allowing the extension to visualize and analyze component performance.

## Installation
```bash
npm install lit-profiler-helper
```

## Usage
Add this at the root of your app (once only):
```ts
import { enableLitProfiler } from 'lit-profiler-helper';

enableLitProfiler({
  trackProperties: true
});
```

This will instrument all Lit components on the page, automatically.

ℹ️ You must also have the Lit Profiler DevTools Extension installed for this to work. This package only emits events — the extension handles the UI.

## Configuration
| Option            | Type    | Default | Description                                                   |
| ----------------- | ------- | ------- | ------------------------------------------------------------- |
| `trackProperties` | boolean | false   | Whether to emit prop diffs between renders using `deepDiff()` |

## Emitted Events
This package emits structured events via `window.__litProfiler.emit(event: { type, data })`.

Available Events:
| Type      | Description                              |
| --------- | ---------------------------------------- |
| `mount`   | When a Lit component is connected        |
| `unmount` | When a Lit component is disconnected     |
| `render`  | When a Lit component finishes `update()` |

Event Format Example:
```ts
{
  type: 'render',
  data: {
    id: 'component-uuid',
    name: 'my-element',
    props: { ... },
    propDiff: {
      changed: { 'title': 'New Title' },
      added: { 'subtitle': 'New Subtitle' },
      removed: { 'oldProp': true }
    },
    time: 55 // render time in ms
  }
}
```

## Internal Concepts
- `patchLifecycle()` intercepts Lit component lifecycle methods.
- `emitDebugEvent()` sends structured data to the DevTools extension.
- `deepDiff()` compares old vs new props to highlight differences.
- `throttle()` prevents render events from firing too frequently.

## DevTools Integration
This package is intended to be used alongside the official Lit Profiler Chrome Extension, which listens to events and visualizes them in a dedicated tab (next to Console/Network/etc.).

You must use both the extension and this package for the profiler to work. 

## Example Workflow
1. User enables profiler with `enableLitProfiler({ trackProperties: true })`.
2. Your app starts emitting lifecycle events.
3. The extension listens to `window.__litProfiler.emit(...)` and updates the DevTools tab.

## Testing
Run the unit tests with [Vitest](https://vitest.dev/):
```bash
npm test
```
To see coverage information:
```bash
npm run test:coverage
```

## License
MIT © Mapherez & contributors
