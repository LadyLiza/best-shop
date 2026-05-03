import productsJson from "../../../assets/data.json";

export type ProductCategory = "carry-ons" | "suitcases" | "luggage sets" | "kids' luggage";
export type ProductColor = "red" | "blue" | "green" | "black" | "grey" | "yellow" | "pink";
export type ProductSize = "S" | "M" | "L" | "XL" | "S-L" | "S, M, XL";
export type ProductBlock = "New Products Arrival" | "Selected Products" | "You May Also Like";

export type CatalogSort = "default" | "price-asc" | "price-desc" | "popularity-desc" | "rating-desc";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  color: ProductColor;
  size: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: ProductBlock[];
}

export interface CatalogQuery {
  search?: string;
  category?: ProductCategory;
  color?: ProductColor;
  size?: ProductSize;
  salesStatus?: boolean;
  sort?: CatalogSort;
  page?: number;
  perPage?: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  from: number;
  to: number;
}

interface ProductsJson {
  data: Product[];
}

const products = (productsJson as ProductsJson).data;

function sortProducts(items: Product[], sort: CatalogSort = "default"): Product[] {
  const sortedItems = [...items];

  if (sort === "price-asc") {
    return sortedItems.sort((first, second) => first.price - second.price);
  }

  if (sort === "price-desc") {
    return sortedItems.sort((first, second) => second.price - first.price);
  }

  if (sort === "popularity-desc") {
    return sortedItems.sort((first, second) => second.popularity - first.popularity);
  }

  if (sort === "rating-desc") {
    return sortedItems.sort((first, second) => second.rating - first.rating);
  }

  return sortedItems;
}

function getUniqueSortedValues<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second));
}

function getShuffledProducts(items: Product[]): Product[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByBlock(block: ProductBlock): Product[] {
  return products.filter((product) => product.blocks.includes(block));
}

export function getRelatedProducts(productId: string, limit: number): Product[] {
  return getShuffledProducts(products.filter((product) => product.id !== productId)).slice(0, limit);
}

export function getCatalogProducts(query: CatalogQuery = {}): CatalogResult {
  const perPage = query.perPage ?? 12;
  const page = Math.max(query.page ?? 1, 1);
  const search = query.search?.trim().toLowerCase();

  const filteredItems = products.filter((product) => {
    const matchesSearch = search ? product.name.toLowerCase().includes(search) : true;
    const matchesCategory = query.category ? product.category === query.category : true;
    const matchesColor = query.color ? product.colors.includes(query.color) : true;
    const matchesSize = query.size ? product.sizes.includes(query.size) : true;
    const matchesSalesStatus =
      typeof query.salesStatus === "boolean" ? product.salesStatus === query.salesStatus : true;

    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesSalesStatus;
  });

  const sortedItems = sortProducts(filteredItems, query.sort);
  const total = sortedItems.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const items = sortedItems.slice(startIndex, startIndex + perPage);
  const from = total === 0 ? 0 : startIndex + 1;
  const to = startIndex + items.length;

  return {
    items,
    total,
    page: currentPage,
    perPage,
    totalPages,
    from,
    to,
  };
}

export function getFilterOptions(): {
  categories: ProductCategory[];
  colors: ProductColor[];
  sizes: ProductSize[];
} {
  return {
    categories: getUniqueSortedValues(products.map((product) => product.category)),
    colors: getUniqueSortedValues(products.flatMap((product) => product.colors)),
    sizes: getUniqueSortedValues(products.flatMap((product) => product.sizes)),
  };
}
