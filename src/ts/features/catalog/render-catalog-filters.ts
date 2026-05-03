import { CatalogFilterControlData, renderCatalogFilterControl } from "./render-catalog-filter-control";
import { getFilterOptions } from "../../app/services/data-repository";

function getTitleCaseLabel(value: string): string {
  return value
    .split(" ")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function renderCatalogFilters(): HTMLElement {
  const filterOptions = getFilterOptions();
  const catalogFilters: CatalogFilterControlData[] = [
    {
      name: "Size",
      field: "size",
      placeholder: "Choose size",
      options: filterOptions.sizes,
    },
    {
      name: "Color",
      field: "color",
      placeholder: "Choose color",
      options: filterOptions.colors.map((color) => ({
        label: getTitleCaseLabel(color),
        value: color,
      })),
    },
    {
      name: "Category",
      field: "category",
      placeholder: "Choose category",
      options: filterOptions.categories.map((category) => ({
        label: getTitleCaseLabel(category),
        value: category,
      })),
    },
    {
      name: "Sales",
      field: "sales",
      placeholder: "Any status",
      options: [
        {
          label: "On Sale",
          value: "true",
        },
        {
          label: "Regular Price",
          value: "false",
        },
      ],
    },
  ];
  const section = document.createElement("section");
  section.className = "catalog-filters";
  section.innerHTML = `
    <div class="catalog-filters-grid" data-catalog-filters-grid></div>
    <div class="catalog-filter-actions">
      <button class="catalog-filter-actions__button" type="button" data-filter-clear>Clear Filters</button>
      <button class="catalog-filter-actions__button" type="button" data-filter-hide>Hide Filters</button>
    </div>
  `;

  const grid = section.querySelector<HTMLElement>(".catalog-filters-grid");
  grid?.append(...catalogFilters.map(renderCatalogFilterControl));

  return section;
}
