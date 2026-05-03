import { renderButton } from "../../app/components/render-button";
import { alertDialog } from "../../app/ui/confirm-dialog";
import {
  renderContactFeedbackField,
  type ContactFeedbackFieldData,
} from "./render-contact-feedback-field";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactFeedbackFields: ContactFeedbackFieldData[] = [
  { label: "Your Name", name: "name" },
  { label: "Your Email Address", name: "email", inputType: "email" },
  { label: "Topic", name: "topic" },
  { label: "Your Message", name: "message", isTextarea: true },
];

const contactFeedbackErrorMessages: Record<string, string> = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  topic: "Please enter a topic.",
  message: "Please enter your message.",
};

function getFieldWrapper(field: HTMLElement): HTMLElement | null {
  return field.closest<HTMLElement>(".contact-feedback-field");
}

function setFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
  const wrapper = getFieldWrapper(field);
  const error = wrapper?.querySelector<HTMLElement>("[data-contact-field-error]");

  wrapper?.classList.add("contact-feedback-field--error");
  field.setAttribute("aria-invalid", "true");

  if (error) {
    error.hidden = false;
    error.textContent = message;
  }
}

function clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
  const wrapper = getFieldWrapper(field);
  const error = wrapper?.querySelector<HTMLElement>("[data-contact-field-error]");

  wrapper?.classList.remove("contact-feedback-field--error");
  field.removeAttribute("aria-invalid");

  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
}

function validateContactField(field: HTMLInputElement | HTMLTextAreaElement, shouldShowError: boolean): boolean {
  const fieldName = field.dataset.contactField ?? "";
  const value = field.value.trim();
  const errorMessage = contactFeedbackErrorMessages[fieldName] ?? "Please fill in this field.";

  if (!value) {
    if (shouldShowError) {
      setFieldError(field, errorMessage);
    }

    return false;
  }

  if (fieldName === "email" && !EMAIL_PATTERN.test(value)) {
    if (shouldShowError) {
      setFieldError(field, errorMessage);
    }

    return false;
  }

  clearFieldError(field);
  return true;
}

function getContactFields(form: HTMLFormElement): Array<HTMLInputElement | HTMLTextAreaElement> {
  return Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-contact-field]"));
}

function initContactFeedbackForm(section: HTMLElement): void {
  const form = section.querySelector<HTMLFormElement>("[data-contact-feedback-form]");

  if (!form) {
    return;
  }

  form.addEventListener("input", (event) => {
    const field = (event.target as HTMLElement).closest<HTMLInputElement | HTMLTextAreaElement>("[data-contact-field]");

    if (!field) {
      return;
    }

    const wrapper = getFieldWrapper(field);
    const shouldValidateNow = field.dataset.contactField === "email"
      ? Boolean(field.value.trim()) || wrapper?.classList.contains("contact-feedback-field--error")
      : wrapper?.classList.contains("contact-feedback-field--error") ?? false;

    if (shouldValidateNow) {
      validateContactField(field, true);
    }

  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = getContactFields(form)
      .map((field) => validateContactField(field, true))
      .every(Boolean);

    if (!isValid) {
      return;
    }

    form.reset();
    getContactFields(form).forEach(clearFieldError);
    void alertDialog({
      title: "Message sent",
      message: "Thank you! Your message has been sent successfully.",
      confirmLabel: "Got it",
    });
  });
}

export function renderContactFeedback(): HTMLElement {
  const section = document.createElement("section");
  section.className = "contact-feedback";
  section.innerHTML = `
    <div class="contact-feedback-layout">
      <div class="contact-feedback__media">
        <img src="/assets/images/contact/feedback-image.jpg" alt="Contact Feedback" loading="lazy">
      </div>
      <div class="contact-feedback__content">
        <h2 class="contact-feedback__title">Your Feedback Is Much Appreciated!</h2>
        <p class="contact-feedback__details">We will contact you when you complete the following form!</p>
        <form class="contact-feedback-form" data-contact-feedback-form novalidate></form>
      </div>
    </div>
  `;

  const form = section.querySelector<HTMLElement>("[data-contact-feedback-form]");
  contactFeedbackFields.forEach((field) => {
    form?.append(renderContactFeedbackField(field));
  });

  form?.append(
    renderButton({
      label: "Send",
      type: "submit",
      className: "contact-feedback__action",
    }),
  );

  initContactFeedbackForm(section);

  return section;
}
