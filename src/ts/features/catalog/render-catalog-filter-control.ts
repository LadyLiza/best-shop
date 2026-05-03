export interface CatalogFilterOptionData {
  label: string;
  value: string;
}

export interface CatalogFilterControlData {
  name: string;
  field: "size" | "color" | "category" | "sales";
  placeholder: string;
  options: Array<string | CatalogFilterOptionData>;
}

function getOptionData(option: string | CatalogFilterOptionData): CatalogFilterOptionData {
  if (typeof option === "string") {
    return {
      label: option,
      value: option,
    };
  }

  return option;
}

export function renderCatalogFilterControl(filter: CatalogFilterControlData): HTMLElement {
  const control = document.createElement("div");
  control.className = "catalog-filter-control";
  control.dataset.filterControl = filter.field;

  const options = (filter.options ?? [])
    .map(getOptionData)
    .map((option) => `
      <button
        class="catalog-filter-dropdown__option"
        type="button"
        role="option"
        aria-selected="false"
        data-filter-option
        data-value="${option.value}"
      >
        ${option.label}
      </button>
    `)
    .join("");

  control.innerHTML = `
    <span class="catalog-filter-control__label">${filter.name}</span>
    <input type="hidden" value="" data-filter-${filter.field}>
    <button
      class="catalog-filter-dropdown__trigger"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="false"
      data-filter-trigger
      data-placeholder="${filter.placeholder}"
    >
      <span data-filter-label>${filter.placeholder}</span>
    </button>
    <div class="catalog-filter-dropdown__menu" role="listbox">
      <button
        class="catalog-filter-dropdown__option catalog-filter-dropdown__option--selected"
        type="button"
        role="option"
        aria-selected="true"
        data-filter-option
        data-value=""
      >
        ${filter.placeholder}
      </button>
      ${options}
    </div>
  `;

  return control;
}
