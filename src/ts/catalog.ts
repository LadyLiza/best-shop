import { renderCatalogFilters } from "./features/catalog/render-catalog-filters";
import { renderCatalogPagination } from "./features/catalog/render-catalog-pagination";
import { renderCatalogProductGrid } from "./features/catalog/render-catalog-product-grid";
import { renderCatalogToolbar } from "./features/catalog/render-catalog-toolbar";
import { renderTopBestSets } from "./features/catalog/render-top-best-sets";
import { initCatalogView } from "./features/catalog/catalog-view";

export function initCatalogPage(): void {
  const root = document.querySelector<HTMLElement>('[data-page-root="catalog"]');

  if (!root) {
    return;
  }

  root.append(
    renderCatalogFilters(),
    renderCatalogToolbar(),
    renderCatalogProductGrid(),
    renderTopBestSets(),
    renderCatalogPagination(),
  );

  initCatalogView(root);
}
