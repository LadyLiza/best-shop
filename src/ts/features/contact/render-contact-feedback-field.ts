export interface ContactFeedbackFieldData {
  label: string;
  name: string;
  inputType?: "email" | "text";
  isTextarea?: boolean;
}

export function renderContactFeedbackField(field: ContactFeedbackFieldData): HTMLElement {
  const fieldElement = document.createElement("label");
  fieldElement.className = field.isTextarea
    ? "contact-feedback-field contact-feedback-field--textarea"
    : "contact-feedback-field";
  const errorId = `contact-feedback-${field.name}-error`;
  const label = `${field.label} <span>*</span>`;
  fieldElement.innerHTML = field.isTextarea
    ? `
      <span class="contact-feedback-field__label">${label}</span>
      <textarea class="contact-feedback-field__control contact-feedback-field__control--textarea" name="${field.name}" required data-contact-field="${field.name}" aria-describedby="${errorId}"></textarea>
      <span class="contact-feedback-field__error" id="${errorId}" data-contact-field-error hidden></span>
    `
    : `
      <span class="contact-feedback-field__label">${label}</span>
      <input class="contact-feedback-field__control" type="${field.inputType ?? "text"}" name="${field.name}" required data-contact-field="${field.name}" aria-describedby="${errorId}">
      <span class="contact-feedback-field__error" id="${errorId}" data-contact-field-error hidden></span>
    `;

  return fieldElement;
}
