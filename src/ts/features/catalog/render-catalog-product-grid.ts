export function renderCatalogProductGrid(): HTMLElement {
  const section = document.createElement("section");
  section.className = "catalog-product-grid";
  section.innerHTML = `
    <div class="catalog-product-grid-list" data-catalog-grid></div>
    <p class="catalog-product-grid__empty" data-catalog-empty hidden>No products found.</p>
  `;

  return section;
}
