export interface ProductGalleryImageData {
  imageUrl: string;
  label: string;
}

export function renderProductGalleryThumbnail(image: ProductGalleryImageData): HTMLElement {
  const thumbnail = document.createElement("div");
  thumbnail.className = "product-gallery-thumbnail";
  thumbnail.innerHTML = `
    <img src="${image.imageUrl}" alt="${image.label}" loading="lazy">
  `;

  return thumbnail;
}
