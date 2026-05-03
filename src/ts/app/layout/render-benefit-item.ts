export interface BenefitItemData {
  details: string;
  iconName: string;
}

export function renderBenefitItem(benefit: BenefitItemData): HTMLElement {
  const item = document.createElement("div");
  item.className = "benefit-item";
  item.innerHTML = `
    <span class="benefit-item__icon benefit-item__icon--${benefit.iconName}" aria-hidden="true"></span>
    <p class="benefit-item__details">${benefit.details}</p>
  `;

  return item;
}
