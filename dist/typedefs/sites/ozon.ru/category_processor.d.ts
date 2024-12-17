import { CategoriesBase } from "../../base/categories.js";
import { BaseCategoryErrorResponse, BaseCategoryResponse } from "../../types/index.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";
import { CategoryResponseData, ResponseOzonItem } from "./types.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: string;
    categoryUrl?: string;
    page?: number;
}
export interface ProcessCategoryResponse extends BaseCategoryResponse<ResponseOzonItem> {
}
export declare class OzonCategoryProcessor extends OzonBase<CategoryResponseData> implements CategoriesBase<FetchCategoryArgs, ProcessCategoryResponse> {
    fetchCategory({ categoryId, categoryUrl, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<ProcessCategoryResponse | BaseCategoryErrorResponse>;
    getPath({ args, nextUrl }: {
        args: string[];
        nextUrl?: string;
    }): string;
    process(data: CategoryResponseData): ProcessCategoryResponse | BaseCategoryErrorResponse;
    filterStates(): string[];
}
//# sourceMappingURL=category_processor.d.ts.map