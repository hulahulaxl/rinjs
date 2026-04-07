// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const componentRegistry = new Map<Function, Set<() => void>>();
export const groupRegistry = new Map<string, Set<() => void>>();

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function register(type: Function, group: string | undefined, trigger: () => void) {
  let cSet = componentRegistry.get(type);
  if (!cSet) {
    cSet = new Set();
    componentRegistry.set(type, cSet);
  }
  cSet.add(trigger);

  let gSet: Set<() => void> | undefined;
  if (group) {
    gSet = groupRegistry.get(group);
    if (!gSet) {
      gSet = new Set();
      groupRegistry.set(group, gSet);
    }
    gSet.add(trigger);
  }

  return () => {
    cSet?.delete(trigger);
    if (gSet) {
      gSet.delete(trigger);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function rerender(target: Function | string) {
  if (typeof target === "string") {
    const triggers = groupRegistry.get(target);
    if (triggers) triggers.forEach(fn => fn());
  } else {
    const triggers = componentRegistry.get(target);
    if (triggers) triggers.forEach(fn => fn());
  }
}
