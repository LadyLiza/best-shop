export interface ContactInfoCardData {
  title: string;
  details: string;
  iconName: string;
}

export function renderContactInfoCard(card: ContactInfoCardData): HTMLElement {
  const article = document.createElement("article");
  article.className = "contact-info-card";
  article.innerHTML = `
    <div class="contact-info-card__icon contact-info-card__icon--${card.iconName}" aria-hidden="true"></div>
    <h3 class="contact-info-card__title">${card.title}</h3>
    <p class="contact-info-card__details">${card.details.replace(/\n/g, "<br>")}</p>
  `;

  return article;
}
