import { lockModalScroll, unlockModalScroll } from "../ui/modal-scroll-lock";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getLoginFieldWrapper(field: HTMLElement): HTMLElement | null {
  return field.closest<HTMLElement>(".login-modal__field");
}

function setLoginFieldError(field: HTMLInputElement, message: string): void {
  const wrapper = getLoginFieldWrapper(field);
  const error = wrapper?.querySelector<HTMLElement>("[data-login-field-error]");

  wrapper?.classList.add("login-modal__field--error");
  field.setAttribute("aria-invalid", "true");

  if (error) {
    error.hidden = false;
    error.textContent = message;
  }
}

function clearLoginFieldError(field: HTMLInputElement): void {
  const wrapper = getLoginFieldWrapper(field);
  const error = wrapper?.querySelector<HTMLElement>("[data-login-field-error]");

  wrapper?.classList.remove("login-modal__field--error");
  field.removeAttribute("aria-invalid");

  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
}

function validateLoginField(field: HTMLInputElement, shouldShowError: boolean): boolean {
  const value = field.value.trim();
  const fieldName = field.dataset.loginField;

  if (fieldName === "email" && (!value || !EMAIL_PATTERN.test(value))) {
    if (shouldShowError) {
      setLoginFieldError(field, "Please enter a valid email address.");
    }

    return false;
  }

  if (fieldName === "password" && !value) {
    if (shouldShowError) {
      setLoginFieldError(field, "Please enter your password.");
    }

    return false;
  }

  clearLoginFieldError(field);
  return true;
}

export function renderLoginModal(): void {
  const root = document.querySelector<HTMLElement>('[data-layout="login-modal"]');

  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="login-modal" aria-hidden="true" data-login-modal>
      <div class="login-modal__overlay"></div>
      <div class="login-modal__dialog" role="dialog" aria-modal="true" aria-label="Login form">
        <button class="login-modal__close" type="button" aria-label="Close login modal" data-login-close></button>

        <form class="login-modal__form" novalidate>
          <label class="login-modal__field">
            <span class="login-modal__label">Email address <span>*</span></span>
            <input class="login-modal__control" type="email" name="email" autocomplete="email" required data-login-field="email" aria-describedby="login-email-error">
            <span class="login-modal__error" id="login-email-error" data-login-field-error hidden></span>
          </label>

          <label class="login-modal__field">
            <span class="login-modal__label">Password <span>*</span></span>
            <span class="login-modal__password">
              <input class="login-modal__control login-modal__control--password" type="password" name="password" autocomplete="current-password" required data-login-field="password" aria-describedby="login-password-error">
              <button class="login-modal__password-toggle" type="button" aria-label="Show password" aria-pressed="false"></button>
            </span>
            <span class="login-modal__error" id="login-password-error" data-login-field-error hidden></span>
          </label>

          <div class="login-modal__options">
            <label class="login-modal__remember">
              <input type="checkbox" name="remember">
              <span>Remember me</span>
            </label>
            <button class="login-modal__forgot" type="button">Forgot Your Password?</button>
          </div>

          <button class="login-modal__submit" type="submit">Log In</button>
        </form>
      </div>
    </div>
  `;

  const modal = root.querySelector<HTMLElement>("[data-login-modal]");
  const overlay = root.querySelector<HTMLElement>(".login-modal__overlay");
  const openButton = document.querySelector<HTMLButtonElement>("[data-login-open]");
  const closeButton = root.querySelector<HTMLButtonElement>("[data-login-close]");
  const firstInput = root.querySelector<HTMLInputElement>(".login-modal__field input");
  const passwordInput = root.querySelector<HTMLInputElement>('.login-modal__control--password');
  const passwordToggle = root.querySelector<HTMLButtonElement>(".login-modal__password-toggle");
  const form = root.querySelector<HTMLFormElement>(".login-modal__form");
  const loginFields = Array.from(root.querySelectorAll<HTMLInputElement>("[data-login-field]"));

  const openModal = (): void => {
    if (modal?.classList.contains("login-modal--open")) {
      return;
    }

    modal?.classList.add("login-modal--open");
    modal?.setAttribute("aria-hidden", "false");
    lockModalScroll();
    firstInput?.focus();
  };

  const closeModal = (): void => {
    if (!modal?.classList.contains("login-modal--open")) {
      return;
    }

    modal?.classList.remove("login-modal--open");
    modal?.setAttribute("aria-hidden", "true");
    unlockModalScroll();
    openButton?.focus();
  };

  openButton?.addEventListener("click", openModal);
  overlay?.addEventListener("click", closeModal);
  closeButton?.addEventListener("click", closeModal);
  form?.addEventListener("input", (event) => {
    const field = (event.target as HTMLElement).closest<HTMLInputElement>("[data-login-field]");

    if (!field) {
      return;
    }

    const wrapper = getLoginFieldWrapper(field);
    const shouldValidateNow = field.dataset.loginField === "email"
      ? Boolean(field.value.trim()) || wrapper?.classList.contains("login-modal__field--error")
      : wrapper?.classList.contains("login-modal__field--error") ?? false;

    if (shouldValidateNow) {
      validateLoginField(field, true);
    }
  });
  passwordToggle?.addEventListener("click", () => {
    if (!passwordInput) {
      return;
    }

    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    passwordToggle.classList.toggle("login-modal__password-toggle--visible", !isPasswordVisible);
    passwordToggle.setAttribute("aria-label", isPasswordVisible ? "Show password" : "Hide password");
    passwordToggle.setAttribute("aria-pressed", String(!isPasswordVisible));
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = loginFields
      .map((field) => validateLoginField(field, true))
      .every(Boolean);

    if (!isValid) {
      return;
    }

    form.reset();
    loginFields.forEach(clearLoginFieldError);
    closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("login-modal--open")) {
      closeModal();
    }
  });
}
