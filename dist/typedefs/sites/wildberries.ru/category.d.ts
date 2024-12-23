import { BaseFetcherArgs, CategoryBase, RequestBase } from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import { BaseCategoryErrorResponse, BaseCategoryResponse } from "../../types/index.js";
import { ResponseWbCategory } from "./index.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: string;
    categoryUrl?: string;
    shard: string;
    key?: string;
    page?: number;
}
export declare class CategoryProcessor extends RequestBase<ResponseWbCategory> implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse> {
    getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
    fetchCategory({ categoryId, shard, key, page, }: FetchCategoryArgs): Promise<BaseCategoryResponse | BaseCategoryErrorResponse>;
}
//# sourceMappingURL=category.d.ts.map