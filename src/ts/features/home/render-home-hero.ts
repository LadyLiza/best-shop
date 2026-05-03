import { renderButton } from "../../app/components/render-button";

export function renderHomeHero(): HTMLElement {
  const section = document.createElement("section");
  section.className = "component--home-hero";
  section.innerHTML = `
    <div class="home-hero-layout">
      <div class="home-hero-content">
        <h1 class="home-hero-title">Smart Styles for Every Destination</h1>
        <p class="home-hero-copy">Phasellus risus turpis, pretium sit amet magna non, molestie ultricies enim. Nullam pulvinar felis at metus.</p>
        <div data-home-hero-action></div>
      </div>

      <div class="home-hero-media">
        <img src="/assets/images/home/header-image.png" alt="Vintage travel suitcase" loading="eager">
      </div>
    </div>
  `;

  section.querySelector("[data-home-hero-action]")?.replaceWith(
    renderButton({
      label: "View All Items",
      href: "/html/catalog.html",
      className: "home-hero-action",
    }),
  );

  return section;
}
