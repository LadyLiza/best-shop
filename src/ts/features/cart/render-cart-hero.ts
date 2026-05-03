import { renderPageHero } from "../../app/sections/render-page-hero";

export function renderCartHero(): HTMLElement {
  return renderPageHero({
    name: "Cart Hero",
    title: "My Cart",
    imageUrl: "/assets/images/cart/banner-image.jpg",
    variant: "cart",
  });
}
