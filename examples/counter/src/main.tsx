import { mount, type ComponentContext } from "rin-lib";

function CounterDisplay(props: { count: number }) {
  // We read from props.count inside the render closure so it sees the latest value
  return () => <p style={{ fontSize: "2rem" }}>Count: {props.count}</p>;
}

type Props = { initialValue: number };

function Counter({ initialValue }: Props, ctx: ComponentContext) {
  // Initialization
  let count = initialValue;
  let inputEl: HTMLInputElement;

  ctx.onMount(() => {
    inputEl.value = "1";
  });

  const increment = () => {
    const value = Number(inputEl.value);

    count += value;
    ctx.rerender();
  };

  const decrement = () => {
    const value = Number(inputEl.value);

    count -= value;
    ctx.rerender();
  };

  // Rendering
  return () => (
    <div
      style={{ padding: "20px", border: "1px solid white", marginTop: "20px" }}
    >
      <CounterDisplay count={count} />

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Uncontrolled Input (should keep state during rerender):
        </label>
        <input
          ref={el => (inputEl = el)}
          type="text"
          placeholder="Type here..."
          style={{ padding: "10px" }}
        />
      </div>

      <button onclick={decrement} style={{ padding: "10px 20px" }}>
        Decrement
      </button>
      <button onclick={increment} style={{ padding: "10px 20px" }}>
        Increment
      </button>
    </div>
  );
}

mount(
  <div
    style={{
      background: "black",
      color: "white",
      minHeight: "100vh",
      padding: "40px"
    }}
  >
    <h1>Rin Counter Test</h1>
    <Counter initialValue={50} />
  </div>,
  document.querySelector<HTMLDivElement>("#app")!
);
