import { renderPageHero } from "../../app/sections/render-page-hero";

export function renderContactHero(): HTMLElement {
  return renderPageHero({
    name: "Contact Hero",
    title: "Contact Us",
    details: "Duis vestibulum elit vel neque pharetra vulputate.<br>Duis rutrum non risus in imperdiet.",
    imageUrl: "/assets/images/contact/banner-image.jpg",
    variant: "contact",
  });
}
