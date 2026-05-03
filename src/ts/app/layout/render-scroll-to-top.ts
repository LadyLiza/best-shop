const LONG_PAGE_EXTRA_SPACE = 240;

function isLongPage(): boolean {
  const documentElement = document.documentElement;
  return documentElement.scrollHeight > window.innerHeight + LONG_PAGE_EXTRA_SPACE;
}

function shouldShowScrollButton(): boolean {
  return isLongPage() && window.scrollY > Math.min(520, window.innerHeight * 0.6);
}

export function renderScrollToTop(): void {
  const button = document.createElement("button");
  button.className = "scroll-to-top";
  button.type = "button";
  button.hidden = true;
  button.setAttribute("aria-label", "Scroll to top");
  button.setAttribute("aria-hidden", "true");
  button.innerHTML = '<span class="scroll-to-top__icon" aria-hidden="true"></span>';

  let frameId = 0;

  const updateButtonVisibility = (): void => {
    frameId = 0;

    const isVisible = shouldShowScrollButton();
    button.hidden = !isVisible;
    button.setAttribute("aria-hidden", String(!isVisible));
  };

  const requestUpdate = (): void => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(updateButtonVisibility);
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  document.body.append(button);

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.body);
  }

  requestUpdate();
}
