import { FetchCategoryArgs, OzonCategoryProcessor } from "./category_processor.js";
import { CategoryResponseData } from "./types.js";
export type CategoryNode = {
    url: string;
    title: string;
    isRoot?: boolean;
    children?: CategoryNode[];
};
interface FetchSellerCategoryArgs extends FetchCategoryArgs {
    sellerId: string;
}
interface FetchSellerSubcategories extends Omit<FetchSellerCategoryArgs, "page"> {
    treeNode?: CategoryNode;
}
export declare class OzonSellerCategoryProcessor extends OzonCategoryProcessor {
    fetchCategory({ categoryId, categoryUrl, preloadedCookies, proxy, page, sellerId, }: FetchSellerCategoryArgs): Promise<{
        cookies: import("../../types/base.js").SimpleCookie[];
        err?: unknown;
        items?: unknown;
        hasNextPage?: boolean;
        nextPage?: string;
    }>;
    fetchSubcategories({ categoryId, preloadedCookies, proxy, sellerId, treeNode, categoryUrl, }: FetchSellerSubcategories): Promise<CategoryNode>;
    getPath({ args, nextUrl }: {
        args: string[];
        nextUrl?: string;
    }): string;
    processSubcategories(data: CategoryResponseData, root?: boolean): {
        children?: CategoryNode[];
        root?: CategoryNode;
        err?: unknown;
    };
}
export {};
//# sourceMappingURL=seller_category_processor.d.ts.map