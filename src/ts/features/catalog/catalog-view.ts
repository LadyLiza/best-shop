import { mapProductToCard } from "../../app/components/map-product-to-card";
import { renderProductCard } from "../../app/components/render-product-card";
import {
  CatalogSort,
  ProductCategory,
  ProductColor,
  ProductSize,
  getAllProducts,
  getCatalogProducts,
} from "../../app/services/data-repository";
import { alertDialog } from "../../app/ui/confirm-dialog";

const PRODUCTS_PER_PAGE = 12;
const FILTER_CLOSE_DELAY_MS = 250;
const filterCloseTimers = new WeakMap<HTMLElement, number>();

interface CatalogState {
  category?: ProductCategory;
  color?: ProductColor;
  size?: ProductSize;
  salesStatus?: boolean;
  sort: CatalogSort;
  page: number;
}

interface CatalogElements {
  results: HTMLElement;
  grid: HTMLElement;
  emptyMessage: HTMLElement;
  sortSelect: HTMLSelectElement;
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
  sizeFilter: HTMLInputElement;
  colorFilter: HTMLInputElement;
  categoryFilter: HTMLInputElement;
  salesFilter: HTMLInputElement;
  clearButton: HTMLButtonElement;
  hideButton: HTMLButtonElement;
  filtersGrid: HTMLElement;
  paginationPages: HTMLElement;
  previousButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
}

function getRequiredElement<T extends HTMLElement>(root: HTMLElement | Document, selector: string): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Catalog element was not found: ${selector}`);
  }

  return element;
}

function getFilterValue<T extends string>(filter: HTMLInputElement): T | undefined {
  return filter.value ? (filter.value as T) : undefined;
}

function getSalesStatusValue(filter: HTMLInputElement): boolean | undefined {
  if (filter.value === "true") {
    return true;
  }

  if (filter.value === "false") {
    return false;
  }

  return undefined;
}

function getCatalogElements(root: HTMLElement): CatalogElements {
  return {
    results: getRequiredElement(root, "[data-catalog-results]"),
    grid: getRequiredElement(root, "[data-catalog-grid]"),
    emptyMessage: getRequiredElement(root, "[data-catalog-empty]"),
    sortSelect: getRequiredElement(root, "[data-catalog-sort]"),
    searchForm: getRequiredElement(root, "[data-catalog-search-form]"),
    searchInput: getRequiredElement(root, "[data-catalog-search]"),
    sizeFilter: getRequiredElement(root, "[data-filter-size]"),
    colorFilter: getRequiredElement(root, "[data-filter-color]"),
    categoryFilter: getRequiredElement(root, "[data-filter-category]"),
    salesFilter: getRequiredElement(root, "[data-filter-sales]"),
    clearButton: getRequiredElement(root, "[data-filter-clear]"),
    hideButton: getRequiredElement(root, "[data-filter-hide]"),
    filtersGrid: getRequiredElement(root, "[data-catalog-filters-grid]"),
    paginationPages: getRequiredElement(root, "[data-pagination-pages]"),
    previousButton: getRequiredElement(root, "[data-pagination-prev]"),
    nextButton: getRequiredElement(root, "[data-pagination-next]"),
  };
}

function renderResultsText(elements: CatalogElements, from: number, to: number, total: number): void {
  elements.results.textContent = total === 0
    ? "Showing 0 Of 0 Results"
    : `Showing ${from}-${to} Of ${total} Results`;
}

function renderPagination(elements: CatalogElements, state: CatalogState, totalPages: number): void {
  elements.paginationPages.innerHTML = "";

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const button = document.createElement("button");
    button.className = `catalog-pagination__page${page === state.page ? " catalog-pagination__page--active" : ""}`;
    button.type = "button";
    button.dataset.page = String(page);
    button.textContent = String(page);

    return button;
  });

  elements.paginationPages.append(...pageButtons);
  elements.previousButton.disabled = state.page <= 1;
  elements.nextButton.disabled = totalPages === 0 || state.page >= totalPages;
}

function getStickyHeaderHeight(): number {
  return document
    .querySelector<HTMLElement>('[data-layout="header"]')
    ?.getBoundingClientRect().height ?? 0;
}

function scrollToResultsText(elements: CatalogElements): void {
  const topOffset = getStickyHeaderHeight() + 24;
  const top = elements.results.getBoundingClientRect().top + window.scrollY - topOffset;

  window.scrollTo(0, Math.max(top, 0));
}

function updateActiveFilters(elements: CatalogElements): void {
  const filters = [
    elements.sizeFilter,
    elements.colorFilter,
    elements.categoryFilter,
    elements.salesFilter,
  ];

  filters.forEach((filter) => {
    filter
      .closest(".catalog-filter-control")
      ?.classList.toggle("catalog-filter-control--active", Boolean(filter.value));
  });
}

function clearFilterCloseTimer(control: HTMLElement): void {
  const timeoutId = filterCloseTimers.get(control);

  if (typeof timeoutId !== "number") {
    return;
  }

  window.clearTimeout(timeoutId);
  filterCloseTimers.delete(control);
}

function closeFilterDropdown(control: HTMLElement): void {
  clearFilterCloseTimer(control);
  control.classList.remove("catalog-filter-control--open");
  control
    .querySelector<HTMLButtonElement>("[data-filter-trigger]")
    ?.setAttribute("aria-expanded", "false");
}

function openFilterDropdown(elements: CatalogElements, control: HTMLElement): void {
  clearFilterCloseTimer(control);
  closeFilterDropdowns(elements, control);
  control.classList.add("catalog-filter-control--open");
  control
    .querySelector<HTMLButtonElement>("[data-filter-trigger]")
    ?.setAttribute("aria-expanded", "true");
}

function scheduleFilterDropdownClose(control: HTMLElement): void {
  clearFilterCloseTimer(control);

  const timeoutId = window.setTimeout(() => {
    closeFilterDropdown(control);
  }, FILTER_CLOSE_DELAY_MS);

  filterCloseTimers.set(control, timeoutId);
}

function closeFilterDropdowns(elements: CatalogElements, exceptControl?: HTMLElement): void {
  elements.filtersGrid
    .querySelectorAll<HTMLElement>(".catalog-filter-control")
    .forEach((control) => {
      if (control !== exceptControl) {
        closeFilterDropdown(control);
      }
    });
}

function setFilterControlValue(input: HTMLInputElement, value: string): void {
  const control = input.closest<HTMLElement>(".catalog-filter-control");

  if (!control) {
    input.value = value;
    return;
  }

  input.value = value;
  control.dataset.value = value;

  const options = Array.from(control.querySelectorAll<HTMLButtonElement>("[data-filter-option]"));
  const selectedOption = options.find((option) => option.dataset.value === value);
  const trigger = control.querySelector<HTMLButtonElement>("[data-filter-trigger]");
  const label = control.querySelector<HTMLElement>("[data-filter-label]");
  const placeholder = trigger?.dataset.placeholder ?? "";

  if (label) {
    label.textContent = selectedOption?.textContent?.trim() ?? placeholder;
  }

  options.forEach((option) => {
    const isSelected = option.dataset.value === value;
    option.classList.toggle("catalog-filter-dropdown__option--selected", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  });
}

function resetFilterControls(elements: CatalogElements): void {
  [
    elements.sizeFilter,
    elements.colorFilter,
    elements.categoryFilter,
    elements.salesFilter,
  ].forEach((filter) => setFilterControlValue(filter, ""));
}

function findProductBySearchTerm(searchTerm: string): string | undefined {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return undefined;
  }

  return getAllProducts().find((product) => (
    product.name.toLowerCase().includes(normalizedSearchTerm)
  ))?.id;
}

export function initCatalogView(root: HTMLElement): void {
  const elements = getCatalogElements(root);
  const state: CatalogState = {
    sort: "default",
    page: 1,
  };

  const renderCatalog = (): void => {
    const result = getCatalogProducts({
      category: state.category,
      color: state.color,
      size: state.size,
      salesStatus: state.salesStatus,
      sort: state.sort,
      page: state.page,
      perPage: PRODUCTS_PER_PAGE,
    });

    state.page = result.page;
    elements.grid.innerHTML = "";
    elements.grid.append(...result.items.map(mapProductToCard).map(renderProductCard));
    elements.emptyMessage.hidden = result.total > 0;
    elements.grid.hidden = result.total === 0;

    renderResultsText(elements, result.from, result.to, result.total);
    renderPagination(elements, state, result.totalPages);
    updateActiveFilters(elements);
  };

  const updateFilters = (): void => {
    state.size = getFilterValue<ProductSize>(elements.sizeFilter);
    state.color = getFilterValue<ProductColor>(elements.colorFilter);
    state.category = getFilterValue<ProductCategory>(elements.categoryFilter);
    state.salesStatus = getSalesStatusValue(elements.salesFilter);
    state.page = 1;
    renderCatalog();
  };

  const goToPage = (page: number): void => {
    const nextPage = Math.max(page, 1);

    if (nextPage === state.page) {
      return;
    }

    state.page = nextPage;
    renderCatalog();
    scrollToResultsText(elements);
  };

  elements.filtersGrid.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const trigger = target.closest<HTMLButtonElement>("[data-filter-trigger]");
    const option = target.closest<HTMLButtonElement>("[data-filter-option]");

    if (trigger) {
      const control = trigger.closest<HTMLElement>(".catalog-filter-control");

      if (!control) {
        return;
      }

      if (control.classList.contains("catalog-filter-control--open")) {
        closeFilterDropdown(control);
        return;
      }

      openFilterDropdown(elements, control);
      return;
    }

    if (!option) {
      return;
    }

    const control = option.closest<HTMLElement>(".catalog-filter-control");
    const input = control?.querySelector<HTMLInputElement>("input[type='hidden']");

    if (!control || !input) {
      return;
    }

    setFilterControlValue(input, option.dataset.value ?? "");
    closeFilterDropdown(control);
    updateFilters();
  });

  elements.filtersGrid.addEventListener("pointerover", (event) => {
    const target = event.target as HTMLElement;
    const control = target.closest<HTMLElement>(".catalog-filter-control");

    if (!control || control.contains(event.relatedTarget as Node | null)) {
      return;
    }

    openFilterDropdown(elements, control);
  });

  elements.filtersGrid.addEventListener("pointerout", (event) => {
    const target = event.target as HTMLElement;
    const control = target.closest<HTMLElement>(".catalog-filter-control");

    if (!control || control.contains(event.relatedTarget as Node | null)) {
      return;
    }

    scheduleFilterDropdownClose(control);
  });

  elements.filtersGrid.addEventListener("focusin", (event) => {
    const control = (event.target as HTMLElement).closest<HTMLElement>(".catalog-filter-control");

    if (control) {
      openFilterDropdown(elements, control);
    }
  });

  elements.filtersGrid.addEventListener("focusout", (event) => {
    const control = (event.target as HTMLElement).closest<HTMLElement>(".catalog-filter-control");

    if (!control || control.contains(event.relatedTarget as Node | null)) {
      return;
    }

    closeFilterDropdown(control);
  });

  elements.sortSelect.addEventListener("change", () => {
    state.sort = elements.sortSelect.value as CatalogSort;
    state.page = 1;
    renderCatalog();
  });

  elements.paginationPages.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-page]");

    if (!button) {
      return;
    }

    goToPage(Number(button.dataset.page));
  });

  elements.previousButton.addEventListener("click", () => {
    goToPage(state.page - 1);
  });

  elements.nextButton.addEventListener("click", () => {
    goToPage(state.page + 1);
  });

  elements.clearButton.addEventListener("click", () => {
    resetFilterControls(elements);
    elements.sortSelect.value = "default";
    elements.searchInput.value = "";

    state.size = undefined;
    state.color = undefined;
    state.category = undefined;
    state.salesStatus = undefined;
    state.sort = "default";
    state.page = 1;

    renderCatalog();
  });

  elements.hideButton.addEventListener("click", () => {
    const isHidden = elements.filtersGrid.hidden;

    elements.filtersGrid.hidden = !isHidden;
    elements.hideButton.textContent = isHidden ? "Hide Filters" : "Show Filters";
  });

  document.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest(".catalog-filters")) {
      return;
    }

    closeFilterDropdowns(elements);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFilterDropdowns(elements);
    }
  });

  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productId = findProductBySearchTerm(elements.searchInput.value);

    if (!productId) {
      void alertDialog({
        title: "Product not found",
        message: "No product matches your search. Try another model name.",
        confirmLabel: "OK",
      });
      return;
    }

    window.location.href = `/html/product.html?id=${productId}`;
  });

  renderCatalog();
}
