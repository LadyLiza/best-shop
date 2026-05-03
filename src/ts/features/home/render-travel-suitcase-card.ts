export interface TravelSuitcaseCardData {
  title?: string;
  text?: string;
  imageUrl: string;
}

export function renderTravelSuitcaseCard(card: TravelSuitcaseCardData): HTMLElement {
  const article = document.createElement("article");
  article.className = "travel-suitcase-card";
  const title = card.title ?? "Travel suitcase";
  const text = card.text ?? "";

  article.innerHTML = `
    <img class="travel-suitcase-card__image" src="${card.imageUrl}" alt="${title}" loading="lazy">
    <div class="travel-suitcase-card__content">
      <h3 class="travel-suitcase-card__title">${title}</h3>
      <p class="travel-suitcase-card__text">${text}</p>
    </div>
  `;

  return article;
}
