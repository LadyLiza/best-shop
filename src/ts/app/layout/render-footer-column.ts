export interface FooterColumnLinkData {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  titleHref?: string;
  links: FooterColumnLinkData[];
}

export function renderFooterColumn(column: FooterColumnData): HTMLElement {
  const section = document.createElement("section");
  section.className = "footer-column";
  const title = column.titleHref
    ? `<a class="footer-heading-link" href="${column.titleHref}">${column.title}</a>`
    : column.title;

  section.innerHTML = `
    <h3 class="footer-column__title">${title}</h3>
    <ul class="footer-column__links">
      ${column.links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join("")}
    </ul>
  `;

  return section;
}
