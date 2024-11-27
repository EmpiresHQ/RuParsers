import { BaseFetcherArgs, OzonBase } from "./base.js";
import { CategoryResponseData, ResponseOzonItem } from "./types.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: string;
    categoryUrl?: string;
    page?: number;
}
export interface ProcessCategoryResponse {
    err?: unknown;
    items?: ResponseOzonItem[];
    hasNextPage?: boolean;
    nextPage?: string;
}
export declare class OzonCategoryProcessor extends OzonBase<CategoryResponseData> {
    fetchCategory({ categoryId, categoryUrl, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<{
        cookies: import("../../types/base.js").SimpleCookie[];
        err?: unknown;
        items?: ResponseOzonItem[];
        hasNextPage?: boolean;
        nextPage?: string;
    }>;
    getPath({ args, nextUrl }: {
        args: string[];
        nextUrl?: string;
    }): string;
    process(data: CategoryResponseData): ProcessCategoryResponse;
    filterStates(): string[];
}
//# sourceMappingURL=category_processor.d.ts.map