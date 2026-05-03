import { renderContactInfoCard, type ContactInfoCardData } from "./render-contact-info-card";

const contactInfoCards: ContactInfoCardData[] = [
  {
    title: "Our Location",
    details: "1234 NW Bobcat Lane, St.\nRobert, MO 65584-5678",
    iconName: "location-pin",
  },
  {
    title: "Operating Time",
    details: "Monday - Friday: 9am - 6 pm\nWeekends: 10:30 am - 6pm",
    iconName: "clock",
  },
  {
    title: "Our Email",
    details: "best@shop.com\ninfo@bestshop.com",
    iconName: "mail",
  },
  {
    title: "Call Us",
    details: "(268)142-8413\n(760)265-2917",
    iconName: "phone",
  },
];

export function renderContactInfoCards(): HTMLElement {
  const section = document.createElement("section");
  section.className = "contact-info-cards";

  const grid = document.createElement("div");
  grid.className = "contact-info-cards-grid";
  contactInfoCards.forEach((card) => {
    grid.append(renderContactInfoCard(card));
  });

  section.append(grid);

  return section;
}
