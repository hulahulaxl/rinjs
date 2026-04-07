export type Product = {
  id: number;
  name: string;
  price: number;
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 120 },
  { id: 2, name: "Wireless Mouse", price: 80 },
  { id: 3, name: "USB-C Hub", price: 40 },
  { id: 4, name: "Ultra-wide Monitor", price: 350 },
];

export const cartItems: Product[] = [];
