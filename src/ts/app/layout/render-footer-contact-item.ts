export interface FooterContactItemData {
  iconName: "phone" | "mail" | "clock" | "location-pin";
  type: string;
  value: string;
}

export function renderFooterContactItem(item: FooterContactItemData): HTMLElement {
  const row = document.createElement("div");
  row.className = "footer-contact-item";
  row.innerHTML = `
    <span class="footer-contact-item__icon footer-contact-item__icon--${item.iconName}" aria-hidden="true"></span>
    <div class="footer-contact-item__value">${item.value}</div>
  `;

  return row;
}
