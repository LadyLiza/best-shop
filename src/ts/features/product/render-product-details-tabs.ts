import { alertDialog } from "../../app/ui/confirm-dialog";

interface ProductDetailsTabData {
  id: string;
  label: string;
}

const productDetailsTabs: ProductDetailsTabData[] = [
  {
    id: "details",
    label: "Details",
  },
  {
    id: "reviews",
    label: "Reviews",
  },
  {
    id: "shipping",
    label: "Shipping Policy",
  },
];

const productDetailsContent = [
  "Vestibulum commodo sapien non elit porttitor, vitae volutpat nibh mollis. Nulla porta risus id neque tempor, in efficitur justo imperdiet. Etiam a ex at ante tincidunt imperdiet. Nunc congue ex vel nisl viverra, sit amet aliquet lectus ullamcorper. Praesent luctus lacus non lorem elementum, eu tristique sapien suscipit. Sed bibendum, ipsum nec viverra malesuada, erat nisi sodales purus, eget hendrerit dui ligula eu enim. Ut non est nisi. Pellentesque tristique pretium dolor eu commodo. Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti.",
  "Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam. Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti.",
  "Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam.",
];

const shippingPolicyContent = [
  "Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Ut sit amet erat nec nibh rhoncus varius in non lorem. Donec interdum, lectus in convallis pulvinar, enim elit porta sapien, vel finibus erat felis sed neque.",
  "Etiam aliquet neque sagittis erat tincidunt aliquam. Orders are carefully packed before dispatch, and shipping updates are sent as soon as your suitcase leaves our warehouse.",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REVIEW_AUTHOR_STORAGE_KEY = "best-shop-review-author";

interface SavedReviewAuthor {
  name: string;
  email: string;
}

function getReviewFormField<T extends HTMLElement>(form: HTMLFormElement, selector: string): T {
  const field = form.querySelector<T>(selector);

  if (!field) {
    throw new Error(`Review form field was not found: ${selector}`);
  }

  return field;
}

function setReviewFormMessage(form: HTMLFormElement, type: "success" | "error", message: string): void {
  const messageElement = getReviewFormField<HTMLElement>(form, "[data-review-message]");

  messageElement.hidden = false;
  messageElement.textContent = message;
  messageElement.classList.toggle("product-review-form__message--success", type === "success");
  messageElement.classList.toggle("product-review-form__message--error", type === "error");
}

function clearReviewFormMessage(form: HTMLFormElement): void {
  const messageElement = getReviewFormField<HTMLElement>(form, "[data-review-message]");

  messageElement.hidden = true;
  messageElement.textContent = "";
  messageElement.classList.remove(
    "product-review-form__message--success",
    "product-review-form__message--error",
  );
}

function clearReviewFormErrors(form: HTMLFormElement): void {
  form
    .querySelectorAll<HTMLElement>(".product-review-form__control--error")
    .forEach((field) => field.classList.remove("product-review-form__control--error"));
}

function markReviewFormFieldError(field: HTMLElement): void {
  field.classList.add("product-review-form__control--error");
}

function setReviewRating(form: HTMLFormElement, rating: number): void {
  const ratingInput = getReviewFormField<HTMLInputElement>(form, "[data-review-rating]");
  const ratingGroup = getReviewFormField<HTMLElement>(form, "[data-review-rating-group]");

  ratingInput.value = String(rating);
  ratingGroup.classList.remove("product-review-form__control--error");
  updateReviewRatingPreview(ratingGroup, rating);
  ratingGroup
    .querySelectorAll<HTMLButtonElement>("[data-review-rating-button]")
    .forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.ratingValue) === rating));
    });
}

function updateReviewRatingPreview(ratingGroup: HTMLElement, rating: number): void {
  const visibleRating = Math.min(Math.max(rating, 0), 5);

  ratingGroup.style.setProperty("--review-rating-fill", `${visibleRating * 20}%`);
  ratingGroup
    .querySelectorAll<HTMLButtonElement>("[data-review-rating-button]")
    .forEach((button) => {
      const buttonRating = Number(button.dataset.ratingValue);

      button.classList.toggle("product-review-form__star--active", buttonRating <= visibleRating);
    });
}

function restoreReviewRatingPreview(form: HTMLFormElement): void {
  const ratingInput = getReviewFormField<HTMLInputElement>(form, "[data-review-rating]");
  const ratingGroup = getReviewFormField<HTMLElement>(form, "[data-review-rating-group]");

  updateReviewRatingPreview(ratingGroup, Number(ratingInput.value || 0));
}

function resetReviewRating(form: HTMLFormElement): void {
  const ratingInput = getReviewFormField<HTMLInputElement>(form, "[data-review-rating]");
  const ratingGroup = getReviewFormField<HTMLElement>(form, "[data-review-rating-group]");

  ratingInput.value = "";
  updateReviewRatingPreview(ratingGroup, 0);
  ratingGroup
    .querySelectorAll<HTMLButtonElement>("[data-review-rating-button]")
    .forEach((button) => {
      button.classList.remove("product-review-form__star--active");
      button.setAttribute("aria-pressed", "false");
    });
}

function readSavedReviewAuthor(): SavedReviewAuthor | undefined {
  const savedValue = window.localStorage.getItem(REVIEW_AUTHOR_STORAGE_KEY);

  if (!savedValue) {
    return undefined;
  }

  try {
    const author = JSON.parse(savedValue) as Partial<SavedReviewAuthor>;

    return typeof author.name === "string" && typeof author.email === "string"
      ? { name: author.name, email: author.email }
      : undefined;
  } catch {
    return undefined;
  }
}

function saveReviewAuthor(author: SavedReviewAuthor): void {
  window.localStorage.setItem(REVIEW_AUTHOR_STORAGE_KEY, JSON.stringify(author));
}

function clearSavedReviewAuthor(): void {
  window.localStorage.removeItem(REVIEW_AUTHOR_STORAGE_KEY);
}

function hydrateReviewForm(form: HTMLFormElement): void {
  const savedAuthor = readSavedReviewAuthor();

  if (!savedAuthor) {
    return;
  }

  const name = getReviewFormField<HTMLInputElement>(form, "[data-review-field='name']");
  const email = getReviewFormField<HTMLInputElement>(form, "[data-review-field='email']");
  const remember = getReviewFormField<HTMLInputElement>(form, "[data-review-remember]");

  name.value = savedAuthor.name;
  email.value = savedAuthor.email;
  remember.checked = true;
}

function handleReviewFormSubmit(form: HTMLFormElement): void {
  const review = getReviewFormField<HTMLTextAreaElement>(form, "[data-review-field='review']");
  const name = getReviewFormField<HTMLInputElement>(form, "[data-review-field='name']");
  const email = getReviewFormField<HTMLInputElement>(form, "[data-review-field='email']");
  const remember = getReviewFormField<HTMLInputElement>(form, "[data-review-remember]");
  const rating = getReviewFormField<HTMLInputElement>(form, "[data-review-rating]");
  const ratingGroup = getReviewFormField<HTMLElement>(form, "[data-review-rating-group]");
  const reviewValue = review.value.trim();
  const nameValue = name.value.trim();
  const emailValue = email.value.trim();
  const ratingValue = rating.value.trim();

  clearReviewFormErrors(form);

  if (!ratingValue || !reviewValue || !nameValue || !emailValue) {
    [review, name, email].forEach((field) => {
      if (!field.value.trim()) {
        markReviewFormFieldError(field);
      }
    });

    if (!ratingValue) {
      markReviewFormFieldError(ratingGroup);
    }

    setReviewFormMessage(form, "error", "Please choose a rating and fill in your review, name, and email address.");
    return;
  }

  if (!EMAIL_PATTERN.test(emailValue)) {
    markReviewFormFieldError(email);
    setReviewFormMessage(form, "error", "Please enter a valid email address.");
    return;
  }

  if (remember.checked) {
    saveReviewAuthor({
      name: nameValue,
      email: emailValue,
    });
  } else {
    clearSavedReviewAuthor();
  }

  clearReviewFormMessage(form);
  form.reset();
  resetReviewRating(form);
  hydrateReviewForm(form);
  void alertDialog({
    title: "Review submitted",
    message: "Thank you! Your review was submitted successfully.",
    confirmLabel: "GOT IT",
  });
}

function renderProductDetailsTabButton(tab: ProductDetailsTabData, isActive: boolean): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = `product-details-tabs__button${isActive ? " product-details-tabs__button--active" : ""}`;
  button.type = "button";
  button.dataset.tabId = tab.id;
  button.setAttribute("aria-selected", String(isActive));
  button.textContent = tab.label;

  return button;
}

function renderProductDetailsTabPanel(tabId: string): string {
  if (tabId === "reviews") {
    return `
      <div class="product-reviews">
        <section class="product-reviews__existing" aria-labelledby="product-review-title">
          <h3 class="product-reviews__title" id="product-review-title">1 review for Global Explorer Max Comfort Suitcase</h3>

          <article class="product-review">
            <img class="product-review__image" src="/assets/images/products/review-customer.png" alt="Ella Harper" loading="lazy">
            <div class="product-review__content">
              <div class="product-review__meta">
                <span class="product-review__author">Ella Harper</span>
                <span class="product-review__date">/ June 11, 2025</span>
                <span class="product-review__rating" aria-label="4 out of 5 stars">
                  <img src="/assets/icons/product/review-stars.svg" alt="" aria-hidden="true">
                </span>
              </div>
              <p class="product-review__text">Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti curabitur ac placerat est, sit amet sodales risus.</p>
            </div>
          </article>
        </section>

        <section class="product-review-form" aria-labelledby="product-review-form-title">
          <h3 class="product-review-form__title" id="product-review-form-title">Add Review</h3>
          <p class="product-review-form__note">Your email address won’t be shared with anybody. Required fields have the symbol <span>*</span></p>

          <form class="product-review-form__fields" data-review-form novalidate>
            <div class="product-review-form__rating">
              <span>Rate Product</span>
              <input type="hidden" name="rating" data-review-rating>
              <div class="product-review-form__stars" role="group" aria-label="Rate product" data-review-rating-group>
                ${[1, 2, 3, 4, 5].map((rating) => `
                  <button
                    class="product-review-form__star"
                    type="button"
                    aria-label="${rating} out of 5 stars"
                    aria-pressed="false"
                    data-review-rating-button
                    data-rating-value="${rating}"
                  ></button>
                `).join("")}
              </div>
            </div>
            <label class="product-review-form__control-wrap product-review-form__control-wrap--textarea">
              <textarea class="product-review-form__textarea" name="review" placeholder="Your Review" aria-label="Your Review" data-review-field="review"></textarea>
              <span class="product-review-form__required-label" aria-hidden="true">Your Review<span>*</span></span>
            </label>
            <div class="product-review-form__row">
              <label class="product-review-form__control-wrap">
                <input class="product-review-form__input" type="text" name="name" placeholder="Your Name" aria-label="Your Name" data-review-field="name">
                <span class="product-review-form__required-label" aria-hidden="true">Your Name<span>*</span></span>
              </label>
              <label class="product-review-form__control-wrap">
                <input class="product-review-form__input" type="email" name="email" placeholder="Your Email" aria-label="Your Email" data-review-field="email">
                <span class="product-review-form__required-label" aria-hidden="true">Your Email<span>*</span></span>
              </label>
            </div>
            <label class="product-review-form__save">
              <input type="checkbox" name="remember" data-review-remember>
              <span>Save my name, email, and website in this browser for when I leave another comment.</span>
            </label>
            <p class="product-review-form__message" data-review-message aria-live="polite" hidden></p>
            <button class="product-review-form__submit" type="submit">Submit</button>
          </form>
        </section>
      </div>
    `;
  }

  const paragraphs = tabId === "shipping" ? shippingPolicyContent : productDetailsContent;

  return `
    <div class="product-details-tabs__text">
      ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

export function renderProductDetailsTabs(): HTMLElement {
  const section = document.createElement("section");
  section.className = "product-details-tabs";
  const initialTab = productDetailsTabs[0];

  section.innerHTML = `
    <div class="product-details-tabs__buttons" role="tablist"></div>
    <div class="product-details-tabs__panel">${renderProductDetailsTabPanel(initialTab.id)}</div>
  `;

  const buttonsRoot = section.querySelector<HTMLElement>(".product-details-tabs__buttons");
  const panel = section.querySelector<HTMLElement>(".product-details-tabs__panel");

  buttonsRoot?.append(
    ...productDetailsTabs.map((tab) => renderProductDetailsTabButton(tab, tab.id === initialTab.id)),
  );

  buttonsRoot?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-tab-id]");

    if (!button || !panel) {
      return;
    }

    const activeTab = productDetailsTabs.find((tab) => tab.id === button.dataset.tabId);

    if (!activeTab) {
      return;
    }

    panel.innerHTML = renderProductDetailsTabPanel(activeTab.id);
    panel.querySelectorAll<HTMLFormElement>("[data-review-form]").forEach(hydrateReviewForm);

    buttonsRoot.querySelectorAll<HTMLButtonElement>("[data-tab-id]").forEach((tabButton) => {
      const isActive = tabButton.dataset.tabId === activeTab.id;

      tabButton.classList.toggle("product-details-tabs__button--active", isActive);
      tabButton.setAttribute("aria-selected", String(isActive));
    });
  });

  section.addEventListener("submit", (event) => {
    const form = (event.target as HTMLElement).closest<HTMLFormElement>("[data-review-form]");

    if (!form) {
      return;
    }

    event.preventDefault();
    handleReviewFormSubmit(form);
  });

  section.addEventListener("input", (event) => {
    const field = (event.target as HTMLElement).closest<HTMLElement>("[data-review-field]");

    if (!field) {
      return;
    }

    field.classList.remove("product-review-form__control--error");
  });

  section.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-review-rating-button]");
    const form = button?.closest<HTMLFormElement>("[data-review-form]");

    if (!button || !form) {
      return;
    }

    setReviewRating(form, Number(button.dataset.ratingValue));
    clearReviewFormMessage(form);
  });

  section.addEventListener("pointerover", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-review-rating-button]");
    const ratingGroup = button?.closest<HTMLElement>("[data-review-rating-group]");

    if (!button || !ratingGroup) {
      return;
    }

    updateReviewRatingPreview(ratingGroup, Number(button.dataset.ratingValue));
  });

  section.addEventListener("pointerout", (event) => {
    const ratingGroup = (event.target as HTMLElement).closest<HTMLElement>("[data-review-rating-group]");
    const form = ratingGroup?.closest<HTMLFormElement>("[data-review-form]");

    if (!ratingGroup || !form || ratingGroup.contains(event.relatedTarget as Node | null)) {
      return;
    }

    restoreReviewRatingPreview(form);
  });

  section.querySelectorAll<HTMLFormElement>("[data-review-form]").forEach(hydrateReviewForm);

  return section;
}
