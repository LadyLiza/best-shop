import { renderHomeHero } from "./render-home-hero";
import { renderIntroPromo } from "./render-intro-promo";

export function renderHomeIntroArea(): HTMLElement {
  const section = document.createElement("section");
  section.className = "component--home-intro-area";
  section.append(renderHomeHero(), renderIntroPromo());

  return section;
}
