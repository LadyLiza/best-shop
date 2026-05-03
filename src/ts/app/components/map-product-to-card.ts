import { Product } from "../services/data-repository";
import { formatCurrency } from "../utils/currency";
import { ProductCardData } from "./render-product-card";

export function mapProductToCard(product: Product): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    price: formatCurrency(product.price),
    imageUrl: product.imageUrl,
    isOnSale: product.salesStatus,
  };
}
