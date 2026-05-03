import { renderButton } from "../../app/components/render-button";

export function renderIntroPromo(): HTMLElement {
  const section = document.createElement("section");
  section.className = "component--intro-promo";
  section.innerHTML = `
    <div class="intro-promo-layout">
      <div class="intro-promo-story">
        <div class="intro-promo-author">
          <img class="intro-promo-author__avatar" src="/assets/images/home/cmo-image.png" alt="Lillian Bennett" loading="lazy">
          <div class="intro-promo-author__content">
            <div class="intro-promo-author__name">Lillian Bennett</div>
            <div class="intro-promo-author__role">Chief Marketing Officer</div>
          </div>
        </div>

        <h2 class="intro-promo-title">Aliquam Faucibus Odionecom.</h2>

        <div class="intro-promo-copy">
          <p>Duis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna. Duis rutrum non risus in imperdiet. Proin molestie accumsan nulla sit.</p>
          <p>Namaki duis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.</p>
        </div>
      </div>

      <div class="intro-promo-discount-card">
        <div class="intro-promo-discount-card__content">
          <h3 class="intro-promo-discount-title">25 % Discount</h3>
          <p class="intro-promo-discount-copy">Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.</p>
          <div data-intro-promo-discount-action></div>
        </div>
      </div>
    </div>
  `;

  section.querySelector("[data-intro-promo-discount-action]")?.replaceWith(
    renderButton({
      label: "Get Discount",
      href: "/html/catalog.html",
      className: "component--intro-promo-discount-action",
    }),
  );

  return section;
}
