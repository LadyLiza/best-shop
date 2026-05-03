import { renderButton } from "../../app/components/render-button";
import { CartSummaryRowData, renderCartSummaryRow } from "./render-cart-summary-row";

const cartSummaryRows: CartSummaryRowData[] = [
  {
    label: "Sub Total",
    value: "$0",
    valueAttribute: "data-cart-subtotal",
  },
  {
    label: "Discount",
    value: "$0",
    rowAttribute: "data-cart-discount-row",
    valueAttribute: "data-cart-discount",
  },
  {
    label: "Shipping",
    value: "$0",
    valueAttribute: "data-cart-shipping",
  },
];

const cartSummaryTotal: CartSummaryRowData = {
  label: "Total",
  value: "$0",
};

export function renderCartSummary(): HTMLElement {
  const section = document.createElement("aside");
  section.className = "cart-summary";
  section.innerHTML = `
    <div class="cart-summary-rows"></div>
    <div class="cart-summary-total">
      <div class="cart-summary-total__label">${cartSummaryTotal.label}</div>
      <div class="cart-summary-total__value" data-cart-total>${cartSummaryTotal.value}</div>
    </div>
    <div data-cart-checkout></div>
  `;

  const rows = section.querySelector<HTMLElement>(".cart-summary-rows");
  rows?.append(...cartSummaryRows.map(renderCartSummaryRow));
  section.querySelector("[data-cart-checkout]")?.replaceWith(
    renderButton({
      label: "Checkout",
      type: "button",
      className: "cart-summary__checkout",
    }),
  );

  const checkoutButton = section.querySelector<HTMLButtonElement>(".cart-summary__checkout");
  checkoutButton?.setAttribute("data-cart-checkout", "true");

  return section;
}
