import { renderToString, jsx } from "rin-lib";

function check(Component: unknown, _props: Record<string, unknown>, _children: unknown) {
  if (typeof Component !== 'function') return false;
  return true; 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderToStaticMarkup(Component: any, props: Record<string, unknown>, { slots }: any) {
  const children = [];
  for (const slotName in slots) {
    children.push(slots[slotName]);
  }
  
  const vnode = jsx(Component, { ...props, children });
  return {
    html: renderToString(vnode)
  };
}

export default {
  check,
  renderToStaticMarkup
};
