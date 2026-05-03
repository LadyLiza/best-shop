export function renderCatalogToolbar(): HTMLElement {
  const section = document.createElement("section");
  section.className = "catalog-controls";
  section.innerHTML = `
    <p class="catalog-controls__results" data-catalog-results>Showing 1-12 Of 15 Results</p>

    <div class="catalog-controls__sort">
      <select class="catalog-controls__select" aria-label="Sort catalog products" data-catalog-sort>
        <option value="default">Default Sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="popularity-desc">Popularity</option>
        <option value="rating-desc">Rating</option>
      </select>
    </div>

    <form class="catalog-controls__search" data-catalog-search-form>
      <input class="catalog-controls__search-input" type="search" placeholder="Search Models" aria-label="Search Models" data-catalog-search>
      <button class="catalog-controls__search-icon" type="submit" aria-label="Search product"></button>
    </form>
  `;

  return section;
}
