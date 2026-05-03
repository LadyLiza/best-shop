export interface TopBestSetItemData {
  title: string;
  price: string;
  rating: number;
  imageUrl: string;
  productUrl: string;
}

export function renderTopBestSetItem(item: TopBestSetItemData): HTMLElement {
  const article = document.createElement("article");
  article.className = "top-best-set-item";
  article.tabIndex = 0;
  article.setAttribute("role", "link");
  article.setAttribute("aria-label", `Open product: ${item.title}`);

  article.innerHTML = `
    <div class="top-best-set-item__image">
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
    </div>
    <div class="top-best-set-item__content">
      <h3 class="top-best-set-item__title">${item.title}</h3>
      <div class="top-best-set-item__rating" aria-label="${item.rating} out of 5 stars">
        <img src="/assets/icons/product/review-stars.svg" alt="" aria-hidden="true">
      </div>
      <div class="top-best-set-item__price">${item.price}</div>
    </div>
  `;

  article.addEventListener("click", () => {
    window.location.href = item.productUrl;
  });

  article.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    window.location.href = item.productUrl;
  });

  return article;
}
