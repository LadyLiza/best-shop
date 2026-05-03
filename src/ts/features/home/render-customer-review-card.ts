export interface CustomerReviewCardData {
  customerName: string;
  location: string;
  reviewText: string;
  avatarUrl: string;
}

export function renderCustomerReviewCard(review: CustomerReviewCardData): HTMLElement {
  const article = document.createElement("article");
  article.className = "customer-review-card";
  article.innerHTML = `
    <div class="customer-review-card__avatar">
      <img src="${review.avatarUrl}" alt="${review.customerName}" loading="lazy">
    </div>
    <p class="customer-review-card__text">${review.reviewText}</p>
    <div class="customer-review-card__author">${review.customerName}, ${review.location}</div>
  `;

  return article;
}
