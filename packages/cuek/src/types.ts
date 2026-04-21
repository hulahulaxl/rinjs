export type ComponentContext = {
  rerender: () => void;
  onMount: (cb: () => void) => void;
  onUnmount: (cb: () => void) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component<P = any> = (
  props: P,
  ctx: ComponentContext
) => () => VNode;

export type VNode = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: string | Component<any>;
  props: Record<string, unknown>;
  children: (VNode | string)[];
};
