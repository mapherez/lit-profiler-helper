export interface DiffResult {
  changed: Record<string, any>;
  added: Record<string, any>;
  removed: Record<string, any>;
}

/**
 * Recursively diff two objects and return maps of changed, added and removed
 * values. Property paths are returned in dot notation.
 */
export function deepDiff(
  obj1: any,
  obj2: any,
  path: string[] = []
): DiffResult {
  const result: DiffResult = {
    changed: {},
    added: {},
    removed: {},
  };

  const keys = new Set([
    ...Object.keys(obj1 || {}),
    ...Object.keys(obj2 || {}),
  ]);

  keys.forEach((key) => {
    const v1 = obj1 ? (obj1 as any)[key] : undefined;
    const v2 = obj2 ? (obj2 as any)[key] : undefined;
    const has1 = obj1 != null && Object.prototype.hasOwnProperty.call(obj1, key);
    const has2 = obj2 != null && Object.prototype.hasOwnProperty.call(obj2, key);
    const currentPath = [...path, key];
    const pathStr = currentPath.join('.');

    if (!has2) {
      result.removed[pathStr] = v1;
    } else if (!has1) {
      result.added[pathStr] = v2;
    } else if (v1 !== v2) {
      if (
        v1 &&
        v2 &&
        typeof v1 === 'object' &&
        typeof v2 === 'object'
      ) {
        const sub = deepDiff(v1, v2, currentPath);
        Object.assign(result.changed, sub.changed);
        Object.assign(result.added, sub.added);
        Object.assign(result.removed, sub.removed);
      } else {
        result.changed[pathStr] = v2;
      }
    }
  });

  return result;
}
