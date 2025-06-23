export function deepDiff(obj1: any, obj2: any): any | undefined {
  if (obj1 === obj2) return undefined;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj2;
  const diff: Record<string, any> = {};
  const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
  keys.forEach((key) => {
    const value1 = (obj1 || {})[key];
    const value2 = (obj2 || {})[key];
    if (value1 !== value2) {
      diff[key] = deepDiff(value1, value2);
    }
  });
  return Object.keys(diff).length ? diff : undefined;
}
