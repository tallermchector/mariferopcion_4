// ./src/lib/types.ts
export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  images: string | null;
  rating: number;
  numReviews: number;
  stock: number;
  featured: boolean;
  categoryId: string;
  category?: CategoryType;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: ProductType;
  quantity: number;
}
