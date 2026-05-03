import { AboutAdvantageItemData, renderAboutAdvantageItem } from "./render-about-advantage-item";

const aboutAdvantages: AboutAdvantageItemData[] = [
  {
    title: "Superior Accuracy",
    details: "Qewist vestibulum elit vel neque pharetra vulputate scelerisque nisi urna.",
    iconName: "superior-accuracy",
  },
  {
    title: "Awards",
    details: "Vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.",
    iconName: "awards",
  },
  {
    title: "Ecological",
    details: "Elit vel neque duis vestibulum pharetra vulputateuisque scelerisque nisi urna.",
    iconName: "ecological",
  },
  {
    title: "Shipping Worldwide",
    details: "Quisque scelerisque nisi urna. Duis vestibulum elit vel neque pharetra vulputate.",
    iconName: "shipping-worldwide",
  },
];

export function renderAboutAdvantages(): HTMLElement {
  const section = document.createElement("section");
  section.className = "about-advantages";
  section.innerHTML = `
    <div class="about-advantages-grid"></div>
  `;

  const grid = section.querySelector<HTMLElement>(".about-advantages-grid");
  grid?.append(...aboutAdvantages.map(renderAboutAdvantageItem));

  return section;
}
