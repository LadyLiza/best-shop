import { renderBenefitsStrip } from "./app/layout/render-benefits-strip";
import { renderFooter } from "./app/layout/render-footer";
import { renderHeader } from "./app/layout/render-header";
import { renderLoginModal } from "./app/layout/render-login-modal";
import { renderScrollToTop } from "./app/layout/render-scroll-to-top";
import { initCartInteractions } from "./app/cart/init-cart-interactions";
import { initAboutPage } from "./about";
import { initCartPage } from "./cart";
import { initCatalogPage } from "./catalog";
import { initContactPage } from "./contact";
import { initHomePage } from "./home";
import { initProductPage } from "./product";

const pageInitializers = {
  home: initHomePage,
  catalog: initCatalogPage,
  product: initProductPage,
  cart: initCartPage,
  about: initAboutPage,
  contact: initContactPage,
};

type PageName = keyof typeof pageInitializers;

function isPageName(page: string | undefined): page is PageName {
  return page !== undefined && page in pageInitializers;
}

renderHeader();
renderBenefitsStrip();
renderFooter();
renderLoginModal();
initCartInteractions();

const currentPage = document.body.dataset.page;

if (isPageName(currentPage)) {
  pageInitializers[currentPage]();
}

renderScrollToTop();
