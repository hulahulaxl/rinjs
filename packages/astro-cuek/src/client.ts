import { mount, jsx } from "cuekjs";

export default (element: HTMLElement) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Component: any, props: Record<string, unknown>, { slots }: any) => {
    // Collect slots into children
    const children = [];
    for (const slotName in slots) {
      const slotValue = slots[slotName];
      if (typeof slotValue === 'string') {
        const div = document.createElement('div');
        div.innerHTML = slotValue;
        children.push(...Array.from(div.childNodes));
      }
    }

    const vnode = jsx(Component, { ...props, children });
    element.innerHTML = ''; 
    mount(vnode, element);
  };
};
