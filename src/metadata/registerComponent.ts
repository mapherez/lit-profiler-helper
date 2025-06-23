let idCounter = 0;
const componentIds = new WeakMap<any, string>();

export function registerComponent(instance: any, autoLabel: boolean): string {
  let id = componentIds.get(instance);
  if (!id) {
    const name = autoLabel && instance.constructor?.name ? instance.constructor.name : 'LitComponent';
    id = `${name}-${++idCounter}`;
    componentIds.set(instance, id);
  }
  return id;
}
