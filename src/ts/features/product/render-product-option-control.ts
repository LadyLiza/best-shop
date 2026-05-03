export interface ProductOptionControlData {
  name: string;
  value: string;
  options: string[];
  field: "size" | "color" | "category";
}

const htmlEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => htmlEntityMap[character]);
}

function closeSiblingDropdowns(control: HTMLElement): void {
  control
    .closest(".product-summary")
    ?.querySelectorAll<HTMLElement>(".product-option-control--open")
    .forEach((openControl) => {
      if (openControl !== control) {
        closeDropdown(openControl);
      }
    });
}

function closeDropdown(control: HTMLElement): void {
  control.classList.remove("product-option-control--open");
  control
    .querySelector<HTMLButtonElement>("[data-product-option-trigger]")
    ?.setAttribute("aria-expanded", "false");
}

function openDropdown(control: HTMLElement): void {
  closeSiblingDropdowns(control);
  control.classList.add("product-option-control--open");
  control
    .querySelector<HTMLButtonElement>("[data-product-option-trigger]")
    ?.setAttribute("aria-expanded", "true");
}

function setSelectedOption(control: HTMLElement, value: string): void {
  const input = control.querySelector<HTMLInputElement>("[data-product-option]");
  const label = control.querySelector<HTMLElement>("[data-product-option-label]");
  const options = control.querySelectorAll<HTMLButtonElement>("[data-product-option-value]");
  const selectedOption = Array.from(options).find((option) => option.dataset.productOptionValue === value);

  if (input) {
    input.value = value;
  }

  if (label) {
    label.textContent = selectedOption?.textContent?.trim() ?? value;
  }

  options.forEach((option) => {
    const isSelected = option.dataset.productOptionValue === value;

    option.classList.toggle("product-option-control__option--selected", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  });
}

function initProductOptionControl(control: HTMLElement): void {
  const trigger = control.querySelector<HTMLButtonElement>("[data-product-option-trigger]");
  const options = control.querySelectorAll<HTMLButtonElement>("[data-product-option-value]");

  trigger?.addEventListener("click", () => {
    if (control.classList.contains("product-option-control--open")) {
      closeDropdown(control);
      return;
    }

    openDropdown(control);
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      setSelectedOption(control, option.dataset.productOptionValue ?? "");
      closeDropdown(control);
      trigger?.focus();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node) || control.contains(target)) {
      return;
    }

    closeDropdown(control);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown(control);
    }
  });
}

export function renderProductOptionControl(option: ProductOptionControlData): HTMLElement {
  const control = document.createElement("div");
  control.className = "product-option-control";
  const labelId = `product-option-${option.field}-label`;
  const options = option.options
    .map((optionValue) => (
      `<button
        class="product-option-control__option${optionValue === option.value ? " product-option-control__option--selected" : ""}"
        type="button"
        role="option"
        aria-selected="${optionValue === option.value}"
        data-product-option-value="${escapeHtml(optionValue)}"
      >${escapeHtml(optionValue)}</button>`
    ))
    .join("");

  control.innerHTML = `
    <span class="product-option-control__label" id="${labelId}">${escapeHtml(option.name)}</span>
    <div class="product-option-control__dropdown">
      <input type="hidden" value="${escapeHtml(option.value)}" data-product-option="${option.field}">
      <button
        class="product-option-control__trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby="${labelId}"
        data-product-option-trigger
      >
        <span data-product-option-label>${escapeHtml(option.value)}</span>
      </button>
      <div class="product-option-control__menu" role="listbox" aria-labelledby="${labelId}">
        ${options}
      </div>
    </div>
  `;

  initProductOptionControl(control);

  return control;
}
