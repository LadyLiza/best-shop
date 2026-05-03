export function renderCartItems(): HTMLElement {
  const section = document.createElement("section");
  section.className = "cart-items";
  section.innerHTML = `
    <div class="cart-items-header" data-cart-items-header>
      <div>Image</div>
      <div>Product Name</div>
      <div>Price</div>
      <div>Quantity</div>
      <div>Total</div>
      <div>Delete</div>
    </div>
    <div class="cart-items-list" data-cart-list></div>
    <section class="cart-empty-state" data-cart-empty hidden>
      <div class="cart-empty-state__icon" aria-hidden="true"></div>
      <h2 class="cart-empty-state__title" data-cart-empty-title>Your cart is empty</h2>
      <p class="cart-empty-state__text" data-cart-empty-text>Your suitcase is still waiting for its first trip. Explore the catalog and add your favorite model.</p>
      <a class="button button--primary cart-empty-state__action" href="/html/catalog.html">Our Catalog</a>
    </section>
  `;

  return section;
}
