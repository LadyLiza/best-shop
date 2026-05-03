import { DISCOUNT_RATE, DISCOUNT_THRESHOLD, SHIPPING_PRICE } from "../config/pricing-rules";
import { clearCartItems, readCartItems, writeCartItems } from "../services/cart-storage";
import { ProductColor, ProductSize, getProductById } from "../services/data-repository";

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  size: ProductSize;
  color: ProductColor;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemsCount: number;
}

export type CartListener = (items: CartItem[], totals: CartTotals) => void;

function syncCartItemWithProduct(item: CartItem): CartItem {
  const product = getProductById(item.productId);

  return product
    ? {
        ...item,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
      }
    : item;
}

let cartItems = readCartItems().map(syncCartItemWithProduct);
const listeners = new Set<CartListener>();

export function getCartItemKey(item: Pick<CartItem, "productId" | "size" | "color">): string {
  return `${item.productId}__${item.size}__${item.color}`;
}

export function getCartItems(): CartItem[] {
  return cartItems.map((item) => ({ ...item }));
}

export function getCartTotals(): CartTotals {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  const shipping = cartItems.length > 0 ? SHIPPING_PRICE : 0;
  const total = subtotal - discount + shipping;
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    subtotal,
    discount,
    shipping,
    total,
    itemsCount,
  };
}

function persistAndNotify(): void {
  if (cartItems.length === 0) {
    clearCartItems();
  } else {
    writeCartItems(cartItems);
  }

  const items = getCartItems();
  const totals = getCartTotals();
  listeners.forEach((listener) => listener(items, totals));
}

export function addCartItem(item: CartItem): void {
  const itemKey = getCartItemKey(item);
  const existingItem = cartItems.find((cartItem) => getCartItemKey(cartItem) === itemKey);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cartItems = [...cartItems, { ...item }];
  }

  persistAndNotify();
}

export function updateCartItemQuantity(key: string, quantity: number): void {
  cartItems = cartItems.map((item) => (
    getCartItemKey(item) === key
      ? { ...item, quantity: Math.max(quantity, 1) }
      : item
  ));

  persistAndNotify();
}

export function removeCartItem(key: string): void {
  cartItems = cartItems.filter((item) => getCartItemKey(item) !== key);
  persistAndNotify();
}

export function clearCart(): void {
  cartItems = [];
  persistAndNotify();
}

export function subscribeCart(listener: CartListener): () => void {
  listeners.add(listener);
  listener(getCartItems(), getCartTotals());

  return () => {
    listeners.delete(listener);
  };
}
