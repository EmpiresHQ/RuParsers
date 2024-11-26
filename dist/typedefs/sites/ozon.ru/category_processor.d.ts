import { BaseFetcherArgs, OzonBase } from "./base.js";
import { CategoryResponseData } from "./types.js";
export interface FetchCategoryArgs extends BaseFetcherArgs {
    categoryId: string;
    categoryUrl?: string;
    page?: number;
}
export declare class OzonCategoryProcessor extends OzonBase<CategoryResponseData> {
    fetchCategory({ categoryId, categoryUrl, preloadedCookies, proxy, page, }: FetchCategoryArgs): Promise<{
        cookies: import("../../types/base.js").SimpleCookie[];
        err?: unknown;
        items?: unknown;
        hasNextPage?: boolean;
        nextPage?: string;
    }>;
    getPath({ args, nextUrl }: {
        args: string[];
        nextUrl?: string;
    }): string;
    process(data: CategoryResponseData): {
        err?: unknown;
        items?: unknown;
        hasNextPage?: boolean;
        nextPage?: string;
    };
    filterStates(): string[];
}
//# sourceMappingURL=category_processor.d.ts.map