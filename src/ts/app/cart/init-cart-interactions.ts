import { addCartItem } from "../state/cart-store";
import { Product, ProductColor, ProductSize, getProductById } from "../services/data-repository";
import { showToast } from "../ui/toast";

function getDefaultSize(product: Product): ProductSize {
  return product.sizes.includes(product.size as ProductSize)
    ? product.size as ProductSize
    : product.sizes[0];
}

function getSelectedOption<T extends string>(
  button: HTMLElement,
  optionName: string,
  fallbackValue: T,
): T {
  const summary = button.closest<HTMLElement>(".product-summary");
  const option = summary?.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-product-option="${optionName}"]`);

  return (option?.value || fallbackValue) as T;
}

function getSelectedQuantity(button: HTMLElement): number {
  const summary = button.closest<HTMLElement>(".product-summary");
  const quantity = summary?.querySelector<HTMLElement>("[data-product-quantity-value]");

  return Math.max(Number(quantity?.textContent ?? 1), 1);
}

function updateProductQuantity(button: HTMLElement, direction: 1 | -1): void {
  const quantityRoot = button.closest<HTMLElement>("[data-product-quantity]");
  const quantityValue = quantityRoot?.querySelector<HTMLElement>("[data-product-quantity-value]");

  if (!quantityValue) {
    return;
  }

  const nextQuantity = Math.max(Number(quantityValue.textContent ?? 1) + direction, 1);
  quantityValue.textContent = String(nextQuantity);
}

function animateAddButton(button: HTMLButtonElement): void {
  button.classList.remove("button--cart-feedback");
  void button.offsetWidth;
  button.classList.add("button--cart-feedback");

  window.setTimeout(() => {
    button.classList.remove("button--cart-feedback");
  }, 520);
}

export function initCartInteractions(): void {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const increaseButton = target.closest<HTMLElement>("[data-product-quantity-increase]");
    const decreaseButton = target.closest<HTMLElement>("[data-product-quantity-decrease]");
    const addButton = target.closest<HTMLButtonElement>("[data-add-to-cart]");

    if (increaseButton) {
      updateProductQuantity(increaseButton, 1);
      return;
    }

    if (decreaseButton) {
      updateProductQuantity(decreaseButton, -1);
      return;
    }

    if (!addButton) {
      return;
    }

    const productId = addButton.dataset.productId;
    const product = productId ? getProductById(productId) : undefined;

    if (!product) {
      return;
    }

    addCartItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      size: getSelectedOption<ProductSize>(addButton, "size", getDefaultSize(product)),
      color: getSelectedOption<ProductColor>(addButton, "color", product.color),
      quantity: getSelectedQuantity(addButton),
    });

    showToast({
      message: `${product.name} added to cart`,
      type: "success",
    });
    animateAddButton(addButton);
  });
}
