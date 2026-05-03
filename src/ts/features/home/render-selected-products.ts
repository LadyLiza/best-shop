import { mapProductToCard } from "../../app/components/map-product-to-card";
import { getProductsByBlock } from "../../app/services/data-repository";
import { renderProductShowcase } from "../../app/sections/render-product-showcase";

export function renderSelectedProducts(): HTMLElement {
  const selectedProducts = getProductsByBlock("Selected Products").map(mapProductToCard);

  return renderProductShowcase({
    name: "Selected Products",
    title: "Selected Products",
    details: "Duis vestibulum elit vel neque pharetra",
    className: "product-showcase--selected",
    products: selectedProducts,
  });
}
