import { renderContactFeedback } from "./features/contact/render-contact-feedback";
import { renderContactHero } from "./features/contact/render-contact-hero";
import { renderContactInfoCards } from "./features/contact/render-contact-info-cards";

export function initContactPage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="contact"]');

  if (!root) {
    return;
  }

  root.append(
    renderContactHero(),
    renderContactInfoCards(),
    renderContactFeedback(),
  );
}
