export interface CartItemRowData {
  key: string;
  name: string;
  price: string;
  size: string;
  color: string;
  quantity: number;
  lineTotal: string;
  imageUrl: string;
}

export function renderCartItemRow(item: CartItemRowData): HTMLElement {
  const row = document.createElement("article");
  row.className = "cart-item-row";
  row.dataset.cartItemKey = item.key;
  row.innerHTML = `
    <div class="cart-item-row__image">
      <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" data-cart-item-image>
    </div>
    <h3 class="cart-item-row__name">
      <span data-cart-item-name>${item.name}</span>
      <small data-cart-item-options>${item.size} / ${item.color}</small>
    </h3>
    <div class="cart-item-row__price" data-cart-item-price>${item.price}</div>
    <div class="cart-item-row__quantity" aria-label="Quantity">
      <button class="cart-item-row__quantity-button cart-item-row__quantity-button--decrease" type="button" aria-label="Decrease quantity" data-cart-quantity-decrease></button>
      <span data-cart-item-quantity>${item.quantity}</span>
      <button class="cart-item-row__quantity-button cart-item-row__quantity-button--increase" type="button" aria-label="Increase quantity" data-cart-quantity-increase></button>
    </div>
    <div class="cart-item-row__line-total" data-cart-item-line-total>${item.lineTotal}</div>
    <button class="cart-item-row__remove" type="button" aria-label="Remove ${item.name}" data-cart-remove>
      <span aria-hidden="true"></span>
    </button>
  `;

  return row;
}

export function updateCartItemRow(row: HTMLElement, item: CartItemRowData): void {
  const image = row.querySelector<HTMLImageElement>("[data-cart-item-image]");
  const name = row.querySelector<HTMLElement>("[data-cart-item-name]");
  const options = row.querySelector<HTMLElement>("[data-cart-item-options]");
  const price = row.querySelector<HTMLElement>("[data-cart-item-price]");
  const quantity = row.querySelector<HTMLElement>("[data-cart-item-quantity]");
  const lineTotal = row.querySelector<HTMLElement>("[data-cart-item-line-total]");
  const removeButton = row.querySelector<HTMLButtonElement>("[data-cart-remove]");

  row.dataset.cartItemKey = item.key;

  if (image && image.getAttribute("src") !== item.imageUrl) {
    image.src = item.imageUrl;
  }

  if (image) {
    image.alt = item.name;
  }

  if (name) {
    name.textContent = item.name;
  }

  if (options) {
    options.textContent = `${item.size} / ${item.color}`;
  }

  if (price) {
    price.textContent = item.price;
  }

  if (quantity) {
    quantity.textContent = String(item.quantity);
  }

  if (lineTotal) {
    lineTotal.textContent = item.lineTotal;
  }

  if (removeButton) {
    removeButton.setAttribute("aria-label", `Remove ${item.name}`);
  }
}
