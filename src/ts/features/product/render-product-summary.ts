import { renderButton } from "../../app/components/render-button";
import { Product, ProductSize } from "../../app/services/data-repository";
import { formatCurrency } from "../../app/utils/currency";
import { ProductOptionControlData, renderProductOptionControl } from "./render-product-option-control";

interface ProductSummaryData {
  title: string;
  rating: number;
  reviewsCount: number;
  price: string;
  details: string[];
  options: ProductOptionControlData[];
}

const productDetails = [
  "The new Global Explorer Max Comfort Suitcase is a bold reimagining of travel essentials, designed to elevate every journey. Made with at least 30% recycled materials, its lightweight yet impact-resistant shell combines eco-conscious innovation with rugged durability.",
  "The ergonomic handle and GlideMotion spinner wheels ensure effortless mobility while making a statement in sleek design. Inside, the modular compartments and adjustable straps keep your belongings secure and neatly organized, no matter the destination.",
];

function createProductSummary(product: Product): ProductSummaryData {
  const defaultSize = product.sizes.includes(product.size as ProductSize) ? product.size : product.sizes[0];

  return {
    title: product.name,
    rating: product.rating,
    reviewsCount: 1,
    price: formatCurrency(product.price),
    details: productDetails,
    options: [
      {
        name: "Size",
        value: defaultSize,
        options: product.sizes,
        field: "size",
      },
      {
        name: "Color",
        value: product.color,
        options: product.colors,
        field: "color",
      },
      {
        name: "Category",
        value: product.category,
        options: [product.category],
        field: "category",
      },
    ],
  };
}

export function renderProductSummary(product: Product): HTMLElement {
  const section = document.createElement("section");
  section.className = "product-summary";
  const productSummary = createProductSummary(product);

  section.innerHTML = `
    <h1 class="product-summary__title">${productSummary.title}</h1>
    <div class="product-summary__rating" aria-label="${productSummary.rating} out of 5 stars">
      <span class="product-summary__stars" aria-hidden="true">
        <img src="/assets/icons/product/review-stars.svg" alt="">
      </span>
      <span class="product-summary__reviews">(${productSummary.reviewsCount} Clients Review)</span>
    </div>
    <div class="product-summary__price">${productSummary.price}</div>
    <div class="product-summary__details">
      ${productSummary.details.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
    <div class="product-summary-options"></div>
    <div class="product-summary__purchase">
      <div class="product-summary__quantity" aria-label="Product quantity" data-product-quantity>
        <button type="button" aria-label="Decrease quantity" data-product-quantity-decrease>-</button>
        <span data-product-quantity-value>1</span>
        <button type="button" aria-label="Increase quantity" data-product-quantity-increase>+</button>
      </div>
      <div data-product-summary-add-to-cart></div>
    </div>
    <div class="product-summary__payments">
      <img
        class="product-summary__payments-image"
        src="/assets/icons/cart/payments.svg"
        alt="Payment methods: Visa, American Express, Mastercard, PayPal"
        loading="lazy"
      >
    </div>
  `;

  const options = section.querySelector<HTMLElement>(".product-summary-options");
  options?.append(...productSummary.options.map(renderProductOptionControl));
  const addToCartButton = renderButton({
    label: "Add To Cart",
    type: "button",
    className: "product-summary__add-to-cart",
  });

  addToCartButton.dataset.productId = product.id;
  addToCartButton.dataset.addToCart = "true";
  section.querySelector("[data-product-summary-add-to-cart]")?.replaceWith(addToCartButton);

  return section;
}
