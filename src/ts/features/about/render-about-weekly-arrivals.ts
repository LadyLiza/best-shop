import { renderButton } from "../../app/components/render-button";

export function renderAboutWeeklyArrivals(): HTMLElement {
  const section = document.createElement("section");
  section.className = "about-weekly-arrivals";
  section.innerHTML = `
    <div class="about-weekly-arrivals-layout">
      <div class="about-weekly-arrivals__content">
        <h2 class="about-weekly-arrivals__title">New Arrivals Every Week</h2>
        <div class="about-weekly-arrivals__details">
          <p>Duis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna. Duis rutrum non risus in imperdiet. Proin molestie accumsan nulla sit. Quisque scelerisque nisi urna.</p>
          <p>Vitrumuis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna. Duis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.</p>
        </div>
        <div data-about-weekly-arrivals-action></div>
      </div>

      <div class="about-weekly-arrivals__media">
        <img src="/assets/images/about/new-arrivals-image.jpg" alt="New Arrivals Every Week" loading="lazy">
      </div>
    </div>
  `;

  section.querySelector("[data-about-weekly-arrivals-action]")?.replaceWith(
    renderButton({
      label: "See All Models",
      href: "/html/catalog.html",
      className: "about-weekly-arrivals__action",
    }),
  );

  return section;
}
