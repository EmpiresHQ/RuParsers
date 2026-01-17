import { BaseFetcherArgs, CategoryBase, RequestBase } from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import { BaseCategoryErrorResponse, BaseCategoryResponse, SimpleCookie } from "../../types/index.js";
import { CategoryResponse, ImageResponse, PricePayload, PriceResponse } from "./index.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: number | string;
    categoryUrl?: string;
    page?: number;
}
export declare class CategoryProcessor extends RequestBase<CategoryResponse> implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse> {
    getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
    fetchCategory({ categoryUrl, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<BaseCategoryResponse | BaseCategoryErrorResponse>;
    fetchImages(productIds: string[], cookies: SimpleCookie[]): Promise<ImageResponse>;
    fetchPrices(pl: PricePayload[], cookies: SimpleCookie[]): Promise<PriceResponse>;
}
//# sourceMappingURL=category_v2.d.ts.map