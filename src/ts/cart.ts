import { renderCartActions } from "./features/cart/render-cart-actions";
import { renderCartHero } from "./features/cart/render-cart-hero";
import { renderCartItems } from "./features/cart/render-cart-items";
import { renderCartSummary } from "./features/cart/render-cart-summary";
import { initCartView } from "./features/cart/cart-view";

export function initCartPage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="cart"]');

  if (!root) {
    return;
  }

  root.append(
    renderCartHero(),
    renderCartItems(),
    renderCartSummary(),
    renderCartActions(),
  );

  initCartView(root);
}
