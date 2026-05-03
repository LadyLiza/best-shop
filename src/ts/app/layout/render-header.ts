import { subscribeCart } from "../state/cart-store";

export function renderHeader(): void {
  const root = document.querySelector<HTMLElement>('[data-layout="header"]');

  if (!root) {
    return;
  }

  const currentPage = document.body.dataset.page;

  root.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <div class="header-top">
          <div class="header-social-links" aria-label="Social links">
            <a class="header-social-link" href="#" aria-label="Facebook">
              <span class="header-icon header-social-link__icon header-social-link__icon--facebook"></span>
            </a>
            <a class="header-social-link" href="#" aria-label="Twitter">
              <span class="header-icon header-social-link__icon header-social-link__icon--twitter"></span>
            </a>
            <a class="header-social-link" href="#" aria-label="Instagram">
              <span class="header-icon header-social-link__icon header-social-link__icon--instagram"></span>
            </a>
          </div>

          <a class="header-logo" href="/" aria-label="Best Shop home">
            <span class="header-logo__icon" aria-hidden="true"></span>
            <span class="header-logo__text">BEST SHOP</span>
          </a>

          <div class="header-actions" aria-label="Header actions">
            <button
              class="header-menu-toggle"
              type="button"
              aria-label="Open navigation menu"
              aria-controls="site-navigation"
              aria-expanded="false"
              data-navigation-toggle
            >
              <span aria-hidden="true"></span>
            </button>
            <button class="header-action-link" type="button" aria-label="Login" data-login-open>
              <span class="header-icon header-action-link__icon header-action-link__icon--user"></span>
            </button>
            <a class="header-action-link" href="/html/cart.html" aria-label="Cart">
              <span class="header-icon header-action-link__icon header-action-link__icon--cart"></span>
              <span class="header-cart-counter" data-cart-counter hidden>0</span>
            </a>
          </div>
        </div>

        <nav class="header-navigation" id="site-navigation" aria-label="Main navigation" data-header-navigation>
          <a class="header-navigation__link ${currentPage === "home" ? "header-navigation__link--active" : ""}" href="/">Home</a>
          <a class="header-navigation__link ${currentPage === "catalog" ? "header-navigation__link--active" : ""}" href="/html/catalog.html">
            <span>Catalog</span>
            <span class="header-icon header-navigation__chevron"></span>
          </a>
          <a class="header-navigation__link ${currentPage === "about" ? "header-navigation__link--active" : ""}" href="/html/about.html">About Us</a>
          <a class="header-navigation__link ${currentPage === "contact" ? "header-navigation__link--active" : ""}" href="/html/contact.html">Contact Us</a>
        </nav>
      </div>
    </header>
  `;

  const header = root.querySelector<HTMLElement>(".site-header");
  const navigation = root.querySelector<HTMLElement>("[data-header-navigation]");
  const navigationToggle = root.querySelector<HTMLButtonElement>("[data-navigation-toggle]");
  const cartCounter = root.querySelector<HTMLElement>("[data-cart-counter]");

  const setNavigationOpen = (isOpen: boolean): void => {
    header?.classList.toggle("site-header--navigation-open", isOpen);
    navigationToggle?.setAttribute("aria-expanded", String(isOpen));
    navigationToggle?.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  };

  navigationToggle?.addEventListener("click", () => {
    setNavigationOpen(!header?.classList.contains("site-header--navigation-open"));
  });

  navigation?.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) {
      setNavigationOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node) || root.contains(target)) {
      return;
    }

    setNavigationOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavigationOpen(false);
    }
  });

  if (cartCounter) {
    subscribeCart((_, totals) => {
      cartCounter.textContent = String(totals.itemsCount);
      cartCounter.hidden = totals.itemsCount === 0;
    });
  }
}
