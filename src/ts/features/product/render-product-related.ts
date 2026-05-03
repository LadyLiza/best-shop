import { mapProductToCard } from "../../app/components/map-product-to-card";
import { getRelatedProducts } from "../../app/services/data-repository";
import { renderProductShowcase } from "../../app/sections/render-product-showcase";

export function renderProductRelated(productId: string): HTMLElement {
  const relatedProducts = getRelatedProducts(productId, 4).map(mapProductToCard);

  return renderProductShowcase({
    name: "You May Also Like",
    title: "You May Also Like",
    hasVisualStrip: true,
    className: "product-showcase--related",
    products: relatedProducts,
  });
}
