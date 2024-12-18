import { BaseFetcherArgs, CategoryBase, RequestBase } from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import { BaseCategoryErrorResponse, BaseCategoryResponse } from "../../types/index.js";
import { Page } from "./index.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: number;
    categoryUrl?: string;
    page?: number;
}
export declare class CategoryProcessor extends RequestBase<Page> implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse> {
    getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
    fetchCategory({ categoryId, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<BaseCategoryResponse | BaseCategoryErrorResponse>;
}
//# sourceMappingURL=category_v2.d.ts.map