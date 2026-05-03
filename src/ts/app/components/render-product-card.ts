import { renderButton } from "./render-button";

export interface ProductCardData {
  id?: string;
  name: string;
  price: string;
  imageUrl: string;
  isOnSale: boolean;
  actionLabel?: string;
  productUrl?: string;
}

const htmlEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => htmlEntityMap[character]);
}

function renderTwoLineProductName(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length < 2) {
    return `<span class="product-card__title-line">${escapeHtml(name)}</span>`;
  }

  let splitIndex = 1;
  let bestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLine = words.slice(0, index).join(" ");
    const secondLine = words.slice(index).join(" ");
    const difference = Math.abs(firstLine.length - secondLine.length);

    if (difference <= bestDifference) {
      bestDifference = difference;
      splitIndex = index;
    }
  }

  const firstLine = words.slice(0, splitIndex).join(" ");
  const secondLine = words.slice(splitIndex).join(" ");

  return `
    <span class="product-card__title-line">${escapeHtml(firstLine)}</span>
    <span class="product-card__title-line">${escapeHtml(secondLine)}</span>
  `;
}

export function renderProductCard(product: ProductCardData): HTMLElement {
  const article = document.createElement("article");
  article.className = "product-card";
  article.tabIndex = 0;
  article.setAttribute("role", "link");
  article.setAttribute("aria-label", `Open product: ${product.name}`);

  if (product.id) {
    article.dataset.productId = product.id;
  }

  const productUrl = product.productUrl ?? `/html/product.html${product.id ? `?id=${product.id}` : ""}`;

  article.innerHTML = `
    <div class="product-card__image">
      <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
      ${product.isOnSale ? '<span class="product-card__badge">SALE</span>' : ""}
    </div>
    <h3 class="product-card__title">${renderTwoLineProductName(product.name)}</h3>
    <div class="product-card__price">${product.price}</div>
    <div data-product-card-action></div>
  `;

  const actionButton = renderButton({
    label: product.actionLabel ?? "Add To Cart",
    type: "button",
    className: "product-card__action",
  });

  if (product.id) {
    actionButton.dataset.productId = product.id;
    actionButton.dataset.addToCart = "true";
  }

  article.querySelector("[data-product-card-action]")?.replaceWith(actionButton);

  article.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("a, button")) {
      return;
    }

    window.location.href = productUrl;
  });

  article.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    window.location.href = productUrl;
  });

  return article;
}
