export interface TeamMemberCardData {
  name: string;
  role: string;
  imageUrl: string;
}

export function renderTeamMemberCard(member: TeamMemberCardData): HTMLElement {
  const article = document.createElement("article");
  article.className = "team-member-card";
  article.innerHTML = `
    <div class="team-member-card__image">
      <img src="${member.imageUrl}" alt="${member.name}" loading="lazy">
    </div>
    <h3 class="team-member-card__name">${member.name}</h3>
    <p class="team-member-card__role">${member.role}</p>
  `;

  return article;
}
