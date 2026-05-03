import { TopBestSetItemData, renderTopBestSetItem } from "./render-top-best-set-item";
import { getAllProducts } from "../../app/services/data-repository";
import { formatCurrency } from "../../app/utils/currency";

function getTopBestSets(): TopBestSetItemData[] {
  return getAllProducts()
    .filter((product) => product.category === "luggage sets")
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((product) => ({
      title: product.name,
      price: formatCurrency(product.price),
      rating: Math.round(product.rating),
      imageUrl: product.imageUrl,
      productUrl: `/html/product.html?id=${product.id}`,
    }));
}

export function renderTopBestSets(): HTMLElement {
  const section = document.createElement("aside");
  section.className = "top-best-sets";
  section.innerHTML = `
    <h2 class="top-best-sets__title">Top Best Sets</h2>
    <div class="top-best-sets-list"></div>
  `;

  const list = section.querySelector<HTMLElement>(".top-best-sets-list");
  list?.append(...getTopBestSets().map(renderTopBestSetItem));

  return section;
}
