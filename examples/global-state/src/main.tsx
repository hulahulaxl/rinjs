import { mount, rerender } from "rinjs";
import { INITIAL_PRODUCTS, cartItems, type Product } from "./store";

function ProductCatalog() {
  const handleBuy = (product: Product) => {
    // 1. Mutate the completely external global data array logically
    cartItems.push(product);
    
    // 2. Broadcast a highly specific targeted event explicitly to update the disconnected Sidebar!
    rerender("cart-widget");
  };

  return () => (
    <div style={{ flexGrow: "1", padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginTop: "0" }}>Available Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {INITIAL_PRODUCTS.map(product => (
          <div style={{ border: "1px solid #444", padding: "15px", borderRadius: "8px", background: "#1a1a1a", textAlign: "center" }}>
            <h3 style={{ marginTop: "0", fontSize: "1.1rem" }}>{product.name}</h3>
            <p style={{ color: "#4CAF50", fontWeight: "bold" }}>${product.price}</p>
            <button
              onclick={() => handleBuy(product)}
              style={{ padding: "8px 16px", borderRadius: "4px", border: "none", background: "#2196F3", color: "white", cursor: "pointer", fontWeight: "bold", width: "100%" }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Targeted via the framework group attribute explicitly globally!
function CartSidebar() {
  const handleRemove = (index: number) => {
    cartItems.splice(index, 1); // Mutates global state
    rerender("cart-widget"); // Triggers internal re-calculation securely
  };

  return () => {
    const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
      <div style={{ width: "300px", padding: "20px", background: "#111", borderLeft: "1px solid #333", minHeight: "100vh" }}>
        <h2 style={{ marginTop: "0" }}>Your Cart</h2>
        
        {cartItems.length === 0 ? (
          <p style={{ color: "#888" }}>Cart is currently empty.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {cartItems.map((item, index) => (
              <li style={{ padding: "10px 0", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{item.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#4CAF50" }}>${item.price}</span>
                  <button 
                    onclick={() => handleRemove(index)}
                    style={{ padding: "4px 8px", background: "#f44336", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #444", display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
          <span>Total:</span>
          <span>${totalCost}</span>
        </div>
      </div>
    );
  };
}

function EcommerceApp() {
  return () => (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <ProductCatalog />
      
      {/* 
        This is where the magic happens!
        We bind THIS specific instance of CartSidebar natively to the 'cart-widget' group tracker. 
        It naturally intercepts rerender("cart-widget") calls from ANYWHERE securely.
      */}
      <CartSidebar group="cart-widget" />
    </div>
  );
}

mount(
  <EcommerceApp />,
  document.querySelector<HTMLDivElement>("#app")!
);
