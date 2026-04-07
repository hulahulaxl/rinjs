export function executeUnmount(node: Node) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unmounts = (node as any)._unmount as Array<() => void> | undefined;
  
  if (unmounts) {
    unmounts.forEach(cb => cb());
    // Safe guard to prevent multiple firings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (node as any)._unmount;
  }

  node.childNodes.forEach(child => executeUnmount(child));
}

export function unmount(target: HTMLElement) {
  executeUnmount(target);
  target.innerHTML = ""; // Physically clear out the nested structures post-callback execution
}
