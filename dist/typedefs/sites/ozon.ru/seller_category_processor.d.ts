import { FetchCategoryArgs, OzonCategoryProcessor, ProcessCategoryResponse } from "./category_processor.js";
import { CategoryResponseData } from "./types.js";
import { BaseCategoryErrorResponse } from "../../types/index.js";
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
    fetchCategory({ categoryId, categoryUrl, preloadedCookies, proxy, page, sellerId, }: FetchSellerCategoryArgs): Promise<ProcessCategoryResponse | BaseCategoryErrorResponse>;
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