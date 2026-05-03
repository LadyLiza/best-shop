export interface CartSummaryRowData {
  label: string;
  value: string;
  rowAttribute?: string;
  valueAttribute?: string;
}

export function renderCartSummaryRow(row: CartSummaryRowData): HTMLElement {
  const element = document.createElement("div");
  element.className = "cart-summary-row";
  if (row.rowAttribute) {
    element.setAttribute(row.rowAttribute, "true");
  }
  element.innerHTML = `
    <div class="cart-summary-row__label">${row.label}</div>
    <div class="cart-summary-row__value" ${row.valueAttribute ?? ""}>${row.value}</div>
  `;

  return element;
}
