export interface ButtonData {
  label: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  className?: string;
}

export function renderButton(button: ButtonData): HTMLAnchorElement | HTMLButtonElement {
  const className = ["button", `button--${button.variant ?? "primary"}`, button.className]
    .filter(Boolean)
    .join(" ");

  if (button.href) {
    const link = document.createElement("a");
    link.className = className;
    link.href = button.href;
    link.textContent = button.label;

    return link;
  }

  const element = document.createElement("button");
  element.className = className;
  element.type = button.type ?? "button";
  element.textContent = button.label;

  return element;
}
