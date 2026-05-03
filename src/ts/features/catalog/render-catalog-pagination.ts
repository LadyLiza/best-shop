export function renderCatalogPagination(): HTMLElement {
  const section = document.createElement("nav");
  section.className = "catalog-pagination";
  section.setAttribute("aria-label", "Catalog pagination");
  section.innerHTML = `
    <button class="catalog-pagination__prev" type="button" data-pagination-prev>
      <span aria-hidden="true">‹</span>
      <span>Previous</span>
    </button>
    <div class="catalog-pagination__pages" data-pagination-pages></div>
    <button class="catalog-pagination__next" type="button" data-pagination-next>
      <span>Next</span>
      <span aria-hidden="true">›</span>
    </button>
  `;

  return section;
}
