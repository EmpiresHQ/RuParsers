export type BaseItem<T extends Record<string, unknown> = Record<string, unknown>> = {
    skuId: string;
    title?: string;
    description?: string;
    discountPrice?: string;
    regularPrice: string;
    stock?: number;
    imageUrl?: string;
    isAvailable?: boolean;
} & T;
//# sourceMappingURL=item.d.ts.map