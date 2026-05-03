import { ProductGalleryImageData, renderProductGalleryThumbnail } from "./render-product-gallery-thumbnail";
import { Product } from "../../app/services/data-repository";

const productGalleryThumbnails: ProductGalleryImageData[] = [
  {
    imageUrl: "/assets/images/products/suitcase-small-card-1.png",
    label: "Yellow suitcase side view",
  },
  {
    imageUrl: "/assets/images/products/suitcase-small-4.png",
    label: "Yellow suitcase interior view",
  },
  {
    imageUrl: "/assets/images/products/suitcase-small-2.png",
    label: "Yellow suitcase open view",
  },
  {
    imageUrl: "/assets/images/products/yellow-open-1.png",
    label: "Yellow suitcase open flat view",
  },
];

export function renderProductGallery(product: Product): HTMLElement {
  const section = document.createElement("section");
  section.className = "product-gallery";

  section.innerHTML = `
    <div class="product-gallery__main">
      <img class="product-gallery__main-image" src="${product.imageUrl}" alt="${product.name}">
    </div>
    <div class="product-gallery-thumbnails"></div>
  `;

  const thumbnails = section.querySelector<HTMLElement>(".product-gallery-thumbnails");
  thumbnails?.append(...productGalleryThumbnails.map(renderProductGalleryThumbnail));

  return section;
}
