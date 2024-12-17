import { BaseFetcherArgs, CategoriesBase } from "../../base/index.js";
import { RequestBase } from "../../base/index.js";
import { BaseCategoryErrorResponse, BaseCategoryResponse } from "../../types/index.js";
import { Page } from "./index.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: string;
    categoryUrl?: string;
    page?: number;
}
export declare class CategoryProcessor extends RequestBase<Page> implements CategoriesBase<FetchCategoryArgs, BaseCategoryResponse> {
    fetchCategory({ categoryId, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<BaseCategoryResponse | BaseCategoryErrorResponse>;
}
//# sourceMappingURL=category_v2.d.ts.map