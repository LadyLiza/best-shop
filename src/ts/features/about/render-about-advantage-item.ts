export interface AboutAdvantageItemData {
  title: string;
  details: string;
  iconName: string;
}

export function renderAboutAdvantageItem(advantage: AboutAdvantageItemData): HTMLElement {
  const item = document.createElement("article");
  item.className = "about-advantage-item";
  item.innerHTML = `
    <div class="about-advantage-item__icon about-advantage-item__icon--${advantage.iconName}" aria-hidden="true"></div>
    <h3 class="about-advantage-item__title">${advantage.title}</h3>
    <p class="about-advantage-item__details">${advantage.details}</p>
  `;

  return item;
}
