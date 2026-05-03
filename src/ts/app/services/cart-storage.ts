import { CART_STORAGE_KEY } from "../config/storage-keys";
import type { CartItem } from "../state/cart-store";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as CartItem;

  return (
    typeof item.productId === "string"
    && typeof item.name === "string"
    && typeof item.imageUrl === "string"
    && typeof item.price === "number"
    && typeof item.size === "string"
    && typeof item.color === "string"
    && typeof item.quantity === "number"
    && item.quantity > 0
  );
}

export function readCartItems(): CartItem[] {
  const rawItems = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawItems) {
    return [];
  }

  try {
    const parsedItems: unknown = JSON.parse(rawItems);

    return Array.isArray(parsedItems) ? parsedItems.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]): void {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function clearCartItems(): void {
  window.localStorage.removeItem(CART_STORAGE_KEY);
}
