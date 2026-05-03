import { TeamMemberCardData, renderTeamMemberCard } from "./render-team-member-card";

const teamMembers: TeamMemberCardData[] = [
  {
    name: "Natalia Foster",
    role: "Product Manager",
    imageUrl: "/assets/images/about/natalia-foster.png",
  },
  {
    name: "Alexandra Thompson",
    role: "Graphic Designer",
    imageUrl: "/assets/images/about/alexandra-thompson.png",
  },
  {
    name: "Iryna Brooks",
    role: "Head Of Marketing",
    imageUrl: "/assets/images/about/iryna-brooks.png",
  },
];

export function renderAboutTeam(): HTMLElement {
  const section = document.createElement("section");
  section.className = "about-team";
  section.innerHTML = `
    <header class="about-team__header">
      <h2 class="about-team__title">Our Incredible Team</h2>
      <div class="about-team__visual-strip"></div>
    </header>
    <div class="about-team-grid"></div>
  `;

  const grid = section.querySelector<HTMLElement>(".about-team-grid");
  grid?.append(...teamMembers.map(renderTeamMemberCard));

  return section;
}
