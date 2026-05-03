import { renderOfferOfTheMonth } from "./app/sections/render-offer-of-the-month";
import { renderAboutAdvantages } from "./features/about/render-about-advantages";
import { renderAboutHero } from "./features/about/render-about-hero";
import { renderAboutTeam } from "./features/about/render-about-team";
import { renderAboutWeeklyArrivals } from "./features/about/render-about-weekly-arrivals";

export function initAboutPage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="about"]');

  if (!root) {
    return;
  }

  root.append(
    renderAboutHero(),
    renderAboutAdvantages(),
    renderAboutWeeklyArrivals(),
    renderAboutTeam(),
    renderOfferOfTheMonth(),
  );
}
