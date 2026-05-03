import { renderCustomerReviews } from "./features/home/render-customer-reviews";
import { renderHomeIntroArea } from "./features/home/render-home-intro-area";
import { renderNewProductsArrival } from "./features/home/render-new-products-arrival";
import { renderOfferOfTheMonth } from "./app/sections/render-offer-of-the-month";
import { renderSelectedProducts } from "./features/home/render-selected-products";
import { renderTravelSuitcases } from "./features/home/render-travel-suitcases";

export function initHomePage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="home"]');

  if (!root) {
    return;
  }

  root.append(
    renderHomeIntroArea(),
    renderTravelSuitcases(),
    renderSelectedProducts(),
    renderOfferOfTheMonth(),
    renderNewProductsArrival(),
    renderCustomerReviews(),
  );
}
