import { BenefitItemData, renderBenefitItem } from "./render-benefit-item";

const benefits: BenefitItemData[] = [
  {
    details: "Velit nisl sodales eget<br>donec quis. volutpat orci.",
    iconName: "plane",
  },
  {
    details: "Dolor eu varius. Morbi<br>fermentum velit nisl.",
    iconName: "truck",
  },
  {
    details: "Malesuada fames ac ante<br>ipsum primis in faucibus.",
    iconName: "coins",
  },
  {
    details: "Nisl sodales eget donec<br>quis. volutpat orci.",
    iconName: "graduation-cap",
  },
];

export function renderBenefitsStrip(): void {
  const root = document.querySelector<HTMLElement>('[data-layout="benefits"]');

  if (!root) {
    return;
  }

  root.innerHTML = `
    <section class="benefits-strip">
      <div class="benefits-strip__inner">
        <h2 class="benefits-strip__heading">Our Benefits</h2>
        <div class="benefits-strip-list"></div>
      </div>
    </section>
  `;

  const list = root.querySelector<HTMLElement>(".benefits-strip-list");
  list?.append(...benefits.map(renderBenefitItem));
}
