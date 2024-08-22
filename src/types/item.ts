export interface BaseItem {
  skuId: string;
  title?: string;
  description?: string;
  discountPrice?: string;
  regularPrice: string;
  stock?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}
