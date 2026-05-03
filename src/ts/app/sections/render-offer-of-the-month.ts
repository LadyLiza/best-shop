import { renderButton } from "../components/render-button";

export function renderOfferOfTheMonth(): HTMLElement {
  const section = document.createElement("section");
  section.className = "offer-of-the-month";
  section.innerHTML = `
    <div class="offer-of-the-month__discount">
      <div class="offer-of-the-month__percent">50%</div>
      <p class="offer-of-the-month__discount-copy">Curabitur vulputate arcu odio, ac facilisis diam.</p>
    </div>

    <div class="offer-of-the-month__content">
      <h2 class="offer-of-the-month__title">Offer Of The Month</h2>
      <p class="offer-of-the-month__copy">Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.</p>
      <div data-offer-action></div>
    </div>
  `;

  section.querySelector("[data-offer-action]")?.replaceWith(
    renderButton({
      label: "Get Offer Today",
      href: "/html/catalog.html",
      className: "offer-of-the-month__action",
    }),
  );

  return section;
}
