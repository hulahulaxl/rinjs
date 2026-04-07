import { mount, type ComponentContext } from "rinjs";

type Props = {
  initialValue: number;
};

function Counter({ initialValue }: Props, ctx: ComponentContext) {
  // Initialization
  let count = initialValue;

  const increment = () => {
    count++;
    ctx.rerender();
  };

  const decrement = () => {
    count--;
    ctx.rerender();
  };

  // Rendering
  return () => (
    <div
      style={{ padding: "20px", border: "1px solid white", marginTop: "20px" }}
    >
      <p style={{ fontSize: "2rem" }}>Count: {count}</p>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Uncontrolled Input (should keep state during rerender):
        </label>
        <input
          type="text"
          placeholder="Type here..."
          style={{ padding: "10px" }}
          oninput={increment}
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
    <h1>RinJS Counter Test</h1>
    <Counter initialValue={50} />
  </div>,
  document.querySelector<HTMLDivElement>("#app")!
);
