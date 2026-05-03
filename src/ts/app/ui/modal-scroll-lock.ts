const MODAL_OPEN_CLASS = "is-login-modal-open";
const SCROLLBAR_WIDTH_PROPERTY = "--modal-scrollbar-width";

let lockCount = 0;

function getScrollbarWidth(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

export function lockModalScroll(): void {
  if (lockCount === 0) {
    document.body.style.setProperty(SCROLLBAR_WIDTH_PROPERTY, `${getScrollbarWidth()}px`);
    document.body.classList.add(MODAL_OPEN_CLASS);
  }

  lockCount += 1;
}

export function unlockModalScroll(): void {
  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0) {
    document.body.classList.remove(MODAL_OPEN_CLASS);
    document.body.style.removeProperty(SCROLLBAR_WIDTH_PROPERTY);
  }
}
