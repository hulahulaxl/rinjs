import { mount, type ComponentContext } from "cuekjs";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// <TodoItem />
type TodoItemProps = {
  key?: string | number;
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

function TodoItem(props: TodoItemProps) {
  return () => (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #333",
        textDecoration: props.todo.completed ? "line-through" : "none",
        color: props.todo.completed ? "#888" : "white"
      }}
    >
      <input
        type="checkbox"
        checked={props.todo.completed}
        onchange={() => props.toggleTodo(props.todo.id)}
        style={{ marginRight: "10px", cursor: "pointer" }}
      />
      <input type="text" placeholder="Type here..." />.
      <span style={{ flexGrow: "1" }}>{props.todo.text}</span>
      <button
        onclick={() => props.deleteTodo(props.todo.id)}
        style={{
          padding: "5px 10px",
          cursor: "pointer",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "3px"
        }}
      >
        Delete
      </button>
    </li>
  );
}

// <TodoList />
type TodoListProps = {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

function TodoList(props: TodoListProps) {
  return () => (
    <ul style={{ listStyleType: "none", padding: "0" }}>
      {props.todos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No todos yet!</p>
      ) : null}
      {props.todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={props.toggleTodo}
          deleteTodo={props.deleteTodo}
        />
      ))}
    </ul>
  );
}

// <TodoApp />
function TodoApp(_props: Record<string, unknown>, ctx: ComponentContext) {
  let todos: Todo[] = [
    { id: 1, text: "Learn Cuek", completed: true },
    { id: 2, text: "Build a Todo App", completed: false }
  ];
  let inputEl: HTMLInputElement | null = null;

  const addTodo = () => {
    if (!inputEl || !inputEl.value.trim()) return;

    // Explicit mutation via pure JS data layout
    todos = [
      ...todos,
      { id: Date.now(), text: inputEl.value.trim(), completed: false }
    ];

    inputEl.value = "";
    ctx.rerender(); // Broadcasts local state update mathematically downward
  };

  const toggleTodo = (id: number) => {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    ctx.rerender();
  };

  const deleteTodo = (id: number) => {
    todos = todos.filter(todo => todo.id !== id);
    ctx.rerender();
  };

  return () => (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        background: "#1a1a1a",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
      }}
    >
      <h1>Cuek Todo Test</h1>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <input
          ref={el => (inputEl = el)}
          type="text"
          placeholder="What needs to be done?"
          style={{
            flexGrow: "1",
            padding: "10px",
            border: "none",
            borderRadius: "4px 0 0 4px"
          }}
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button
          onclick={addTodo}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Add
        </button>
      </div>

      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#666"
        }}
      >
        {todos.filter(t => !t.completed).length} items left
      </div>
    </div>
  );
}

mount(
  <div
    style={{
      background: "#000",
      color: "white",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "sans-serif"
    }}
  >
    <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
      State Management Example
    </h1>
    <TodoApp />
  </div>,
  document.querySelector<HTMLDivElement>("#app")!
);
