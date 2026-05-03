export type PageHeroVariant = "about" | "contact" | "cart";

export interface PageHeroData {
  name: string;
  title: string;
  details?: string;
  imageUrl?: string;
  variant: PageHeroVariant;
}

export function renderPageHero(hero: PageHeroData): HTMLElement {
  const section = document.createElement("section");
  section.className = `page-hero page-hero--${hero.variant}`;
  section.innerHTML = `
    ${
      hero.imageUrl
        ? `<img class="page-hero__image" src="${hero.imageUrl}" alt="${hero.name}" loading="lazy">`
        : ""
    }
    <div class="page-hero__content">
      <h1 class="page-hero__title">${hero.title}</h1>
      ${hero.details ? `<p class="page-hero__details">${hero.details}</p>` : ""}
    </div>
  `;

  return section;
}
