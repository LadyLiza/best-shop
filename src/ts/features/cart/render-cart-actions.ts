import { renderButton } from "../../app/components/render-button";

export function renderCartActions(): HTMLElement {
  const section = document.createElement("section");
  section.className = "cart-actions";
  section.innerHTML = `
    <div class="cart-actions-layout">
      <div data-cart-continue-shopping></div>
      <div data-cart-clear></div>
    </div>
  `;

  section.querySelector("[data-cart-continue-shopping]")?.replaceWith(
    renderButton({
      label: "Continue Shopping",
      href: "/html/catalog.html",
      className: "cart-actions__button",
    }),
  );
  section.querySelector("[data-cart-clear]")?.replaceWith(
    renderButton({
      label: "Clear Shopping Cart",
      type: "button",
      className: "cart-actions__button",
    }),
  );

  const clearButton = section.querySelector<HTMLButtonElement>(".cart-actions__button:not(a)");
  clearButton?.setAttribute("data-cart-clear", "true");

  return section;
}
