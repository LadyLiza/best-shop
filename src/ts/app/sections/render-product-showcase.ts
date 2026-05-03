import { ProductCardData, renderProductCard } from "../components/render-product-card";

export interface ProductShowcaseData {
  name: string;
  title: string;
  details?: string;
  hasVisualStrip?: boolean;
  className?: string;
  products: ProductCardData[];
}

export function renderProductShowcase(showcase: ProductShowcaseData): HTMLElement {
  const section = document.createElement("section");
  section.className = ["product-showcase", showcase.className].filter(Boolean).join(" ");
  section.innerHTML = `
    <div class="product-showcase__header">
      <h2 class="product-showcase__heading">${showcase.title}</h2>
      ${showcase.details ? `<p class="product-showcase__details">${showcase.details}</p>` : ""}
      ${showcase.hasVisualStrip ? '<div class="product-showcase__visual-strip"></div>' : ""}
    </div>
    <div class="product-showcase-grid"></div>
  `;

  const grid = section.querySelector<HTMLElement>(".product-showcase-grid");
  grid?.append(...showcase.products.map(renderProductCard));

  return section;
}
