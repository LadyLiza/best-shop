import { formatCurrency } from "../../app/utils/currency";
import { confirmDialog } from "../../app/ui/confirm-dialog";
import {
  CartItem,
  CartTotals,
  clearCart,
  getCartItemKey,
  removeCartItem,
  subscribeCart,
  updateCartItemQuantity,
} from "../../app/state/cart-store";
import { CartItemRowData, renderCartItemRow, updateCartItemRow } from "./render-cart-item-row";

interface CartEmptyState {
  title: string;
  text: string;
}

const EMPTY_CART_STATE: CartEmptyState = {
  title: "Your cart is empty",
  text: "Your suitcase is still waiting for its first trip.\nExplore the catalog and add your favorite model.",
};

const CHECKOUT_STATE: CartEmptyState = {
  title: "Thank you for your purchase.",
  text: "Your order is confirmed. You can return to the catalog whenever you are ready for another trip.",
};

interface CartElements {
  root: HTMLElement;
  header: HTMLElement;
  list: HTMLElement;
  emptyState: HTMLElement;
  emptyTitle: HTMLElement;
  emptyText: HTMLElement;
  summary: HTMLElement;
  actions: HTMLElement;
  subtotal: HTMLElement;
  discountRow: HTMLElement;
  discount: HTMLElement;
  shipping: HTMLElement;
  total: HTMLElement;
  clearButton: HTMLButtonElement;
  checkoutButton: HTMLButtonElement;
}

function getRequiredElement<T extends HTMLElement>(root: HTMLElement, selector: string): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Cart element was not found: ${selector}`);
  }

  return element;
}

function getCartElements(root: HTMLElement): CartElements {
  return {
    root,
    header: getRequiredElement(root, "[data-cart-items-header]"),
    list: getRequiredElement(root, "[data-cart-list]"),
    emptyState: getRequiredElement(root, "[data-cart-empty]"),
    emptyTitle: getRequiredElement(root, "[data-cart-empty-title]"),
    emptyText: getRequiredElement(root, "[data-cart-empty-text]"),
    summary: getRequiredElement(root, ".cart-summary"),
    actions: getRequiredElement(root, ".cart-actions"),
    subtotal: getRequiredElement(root, "[data-cart-subtotal]"),
    discountRow: getRequiredElement(root, "[data-cart-discount-row]"),
    discount: getRequiredElement(root, "[data-cart-discount]"),
    shipping: getRequiredElement(root, "[data-cart-shipping]"),
    total: getRequiredElement(root, "[data-cart-total]"),
    clearButton: getRequiredElement(root, "[data-cart-clear]"),
    checkoutButton: getRequiredElement(root, "[data-cart-checkout]"),
  };
}

function mapCartItemToRow(item: CartItem): CartItemRowData {
  return {
    key: getCartItemKey(item),
    name: item.name,
    price: formatCurrency(item.price),
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    lineTotal: formatCurrency(item.price * item.quantity),
    imageUrl: item.imageUrl,
  };
}

function renderTotals(elements: CartElements, totals: CartTotals): void {
  elements.subtotal.textContent = formatCurrency(totals.subtotal);
  elements.discount.textContent = totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : formatCurrency(0);
  elements.discountRow.hidden = totals.discount <= 0;
  elements.shipping.textContent = formatCurrency(totals.shipping);
  elements.total.textContent = formatCurrency(totals.total);
}

function syncCartRows(elements: CartElements, items: CartItem[]): void {
  const rowItems = items.map(mapCartItemToRow);
  const nextKeys = new Set(rowItems.map((item) => item.key));
  const currentRows = new Map<string, HTMLElement>();

  elements.list.querySelectorAll<HTMLElement>("[data-cart-item-key]").forEach((row) => {
    const key = row.dataset.cartItemKey;

    if (!key || !nextKeys.has(key)) {
      row.remove();
      return;
    }

    currentRows.set(key, row);
  });

  let previousRow: ChildNode | null = null;

  rowItems.forEach((item) => {
    const existingRow = currentRows.get(item.key);
    const row = existingRow ?? renderCartItemRow(item);
    const nextSibling = previousRow ? previousRow.nextSibling : elements.list.firstChild;

    if (existingRow) {
      updateCartItemRow(existingRow, item);
    }

    if (row !== nextSibling) {
      elements.list.insertBefore(row, nextSibling);
    }

    previousRow = row;
  });
}

function renderItems(elements: CartElements, items: CartItem[], emptyState: CartEmptyState): void {
  const isEmpty = items.length === 0;

  syncCartRows(elements, items);
  elements.root.classList.toggle("page--cart--empty", isEmpty);
  elements.emptyTitle.textContent = emptyState.title;
  elements.emptyText.textContent = emptyState.text;
  elements.emptyState.hidden = !isEmpty;
  elements.header.hidden = isEmpty;
  elements.list.hidden = isEmpty;
  elements.summary.hidden = isEmpty;
  elements.actions.hidden = isEmpty;
}

export function initCartView(root: HTMLElement): void {
  const elements = getCartElements(root);
  let emptyState = EMPTY_CART_STATE;
  let currentItems: CartItem[] = [];

  subscribeCart((items, totals) => {
    currentItems = items;
    renderItems(elements, items, emptyState);
    renderTotals(elements, totals);
  });

  elements.list.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>("[data-cart-item-key]");
    const key = row?.dataset.cartItemKey;

    if (!key) {
      return;
    }

    const currentItem = currentItems.find((item) => getCartItemKey(item) === key);

    if (!currentItem) {
      return;
    }

    if (target.closest("[data-cart-quantity-increase]")) {
      updateCartItemQuantity(key, currentItem.quantity + 1);
      return;
    }

    if (target.closest("[data-cart-quantity-decrease]")) {
      updateCartItemQuantity(key, currentItem.quantity - 1);
      return;
    }

    if (target.closest("[data-cart-remove]")) {
      const shouldRemove = await confirmDialog({
        title: "Remove item?",
        message: `${currentItem.name} will be removed from your cart.`,
        confirmLabel: "Remove",
      });

      if (!shouldRemove) {
        return;
      }

      removeCartItem(key);
    }
  });

  elements.clearButton.addEventListener("click", async () => {
    const shouldClear = await confirmDialog({
      title: "Clear cart?",
      message: "This will remove all items from your cart.",
      confirmLabel: "Clear Cart",
    });

    if (!shouldClear) {
      return;
    }

    emptyState = EMPTY_CART_STATE;
    clearCart();
  });

  elements.checkoutButton.addEventListener("click", async () => {
    const shouldCheckout = await confirmDialog({
      title: "Complete purchase?",
      message: "Checkout will clear your cart and finish this order.",
      confirmLabel: "Checkout",
    });

    if (!shouldCheckout) {
      return;
    }

    emptyState = CHECKOUT_STATE;
    clearCart();
  });
}
