type ToastType = "success" | "error";

interface ToastData {
  message: string;
  type?: ToastType;
}

const TOAST_DURATION = 2800;

function getToastRoot(): HTMLElement {
  const existingRoot = document.querySelector<HTMLElement>("[data-toast-root]");

  if (existingRoot) {
    return existingRoot;
  }

  const root = document.createElement("div");
  root.className = "toast-root";
  root.dataset.toastRoot = "true";
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-atomic", "true");
  document.body.append(root);

  return root;
}

export function showToast(toast: ToastData): void {
  const root = getToastRoot();
  const element = document.createElement("div");
  element.className = `toast toast--${toast.type ?? "success"}`;
  element.setAttribute("role", "status");
  element.textContent = toast.message;

  root.append(element);

  window.setTimeout(() => {
    element.classList.add("toast--leaving");
    window.setTimeout(() => {
      element.remove();
    }, 220);
  }, TOAST_DURATION);
}
