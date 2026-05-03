import { renderProductGallery } from "./features/product/render-product-gallery";
import { renderProductRelated } from "./features/product/render-product-related";
import { renderProductSummary } from "./features/product/render-product-summary";
import { renderProductDetailsTabs } from "./features/product/render-product-details-tabs";
import { getAllProducts, getProductById } from "./app/services/data-repository";

export function initProductPage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="product"]');

  if (!root) {
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  const product = productId ? getProductById(productId) : getAllProducts()[0];

  if (!product) {
    root.innerHTML = '<p class="product-page-message">Product not found.</p>';
    return;
  }

  root.append(
    renderProductGallery(product),
    renderProductSummary(product),
    renderProductDetailsTabs(),
    renderProductRelated(product.id),
  );
}
