import { CustomerReviewCardData, renderCustomerReviewCard } from "./render-customer-review-card";

const customerReviews: CustomerReviewCardData[] = [
  {
    customerName: "Ethan Wade",
    location: "New York",
    reviewText: "Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.",
    avatarUrl: "/assets/images/home/grateful-customer-1.png",
  },
  {
    customerName: "Jane Reyes",
    location: "California",
    reviewText: "Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.",
    avatarUrl: "/assets/images/home/grateful-customer-2.png",
  },
  {
    customerName: "Erica Banks",
    location: "Miami",
    reviewText: "Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.",
    avatarUrl: "/assets/images/home/grateful-customer-3.png",
  },
];

export function renderCustomerReviews(): HTMLElement {
  const section = document.createElement("section");
  section.className = "customer-reviews";
  section.innerHTML = `
    <div class="customer-reviews__header">
      <h2 class="customer-reviews__heading">Our Grateful Customers</h2>
      <p class="customer-reviews__details">Duis vestibulum elit vel neque pharetra</p>
    </div>
    <div class="customer-reviews-grid"></div>
  `;

  const grid = section.querySelector<HTMLElement>(".customer-reviews-grid");
  grid?.append(...customerReviews.map(renderCustomerReviewCard));

  return section;
}
