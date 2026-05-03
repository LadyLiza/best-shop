import { mapProductToCard } from "../../app/components/map-product-to-card";
import { getProductsByBlock } from "../../app/services/data-repository";
import { renderProductShowcase } from "../../app/sections/render-product-showcase";

export function renderNewProductsArrival(): HTMLElement {
  const newProducts = getProductsByBlock("New Products Arrival").map(mapProductToCard);

  return renderProductShowcase({
    name: "New Products Arrival",
    title: "New Products Arrival",
    details: "Duis vestibulum elit vel neque pharetra",
    className: "product-showcase--new-arrivals",
    products: newProducts,
  });
}
