import { lockModalScroll, unlockModalScroll } from "./modal-scroll-lock";

interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
}

interface AlertDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
}

function removeDialog(dialog: HTMLElement): void {
  dialog.classList.remove("login-modal--open");
  dialog.setAttribute("aria-hidden", "true");
  unlockModalScroll();
  dialog.remove();
}

export function confirmDialog(data: ConfirmDialogData): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement("div");
    dialog.className = "login-modal confirm-modal login-modal--open";
    dialog.setAttribute("aria-hidden", "false");
    dialog.innerHTML = `
      <div class="login-modal__overlay" data-confirm-cancel></div>
      <div class="login-modal__dialog confirm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <button class="login-modal__close" type="button" aria-label="Close confirmation" data-confirm-cancel></button>
        <h2 class="confirm-modal__title" id="confirm-modal-title">${data.title}</h2>
        <p class="confirm-modal__message">${data.message}</p>
        <div class="confirm-modal__actions">
          <button class="button button--secondary confirm-modal__button" type="button" data-confirm-cancel>${data.cancelLabel ?? "Cancel"}</button>
          <button class="button button--primary confirm-modal__button" type="button" data-confirm-accept>${data.confirmLabel}</button>
        </div>
      </div>
    `;

    const close = (isConfirmed: boolean): void => {
      document.removeEventListener("keydown", handleKeydown);
      removeDialog(dialog);
      resolve(isConfirmed);
    };

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        close(false);
      }
    };

    dialog.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-confirm-accept]")) {
        close(true);
        return;
      }

      if (target.closest("[data-confirm-cancel]")) {
        close(false);
      }
    });

    document.body.append(dialog);
    lockModalScroll();
    document.addEventListener("keydown", handleKeydown);
    dialog.querySelector<HTMLButtonElement>(".confirm-modal__button[data-confirm-cancel]")?.focus();
  });
}

export function alertDialog(data: AlertDialogData): Promise<void> {
  return new Promise((resolve) => {
    const dialog = document.createElement("div");
    dialog.className = "login-modal confirm-modal login-modal--open";
    dialog.setAttribute("aria-hidden", "false");
    dialog.innerHTML = `
      <div class="login-modal__overlay" data-alert-close></div>
      <div class="login-modal__dialog confirm-modal__dialog" role="alertdialog" aria-modal="true" aria-labelledby="alert-modal-title">
        <button class="login-modal__close" type="button" aria-label="Close notification" data-alert-close></button>
        <h2 class="confirm-modal__title" id="alert-modal-title">${data.title}</h2>
        <p class="confirm-modal__message">${data.message}</p>
        <div class="confirm-modal__actions confirm-modal__actions--single">
          <button class="button button--primary confirm-modal__button" type="button" data-alert-close>${data.confirmLabel ?? "OK"}</button>
        </div>
      </div>
    `;

    const close = (): void => {
      document.removeEventListener("keydown", handleKeydown);
      removeDialog(dialog);
      resolve();
    };

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        close();
      }
    };

    dialog.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-alert-close]")) {
        close();
      }
    });

    document.body.append(dialog);
    lockModalScroll();
    document.addEventListener("keydown", handleKeydown);
    dialog.querySelector<HTMLButtonElement>(".confirm-modal__button[data-alert-close]")?.focus();
  });
}
