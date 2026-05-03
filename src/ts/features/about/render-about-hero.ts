import { renderPageHero } from "../../app/sections/render-page-hero";

export function renderAboutHero(): HTMLElement {
  return renderPageHero({
    name: "About Hero",
    title: "About Us",
    details: "Duis vestibulum elit vel neque pharetra vulputate.<br>Duis rutrum non risus in imperdiet.",
    imageUrl: "/assets/images/about/banner-image.jpg",
    variant: "about",
  });
}
