import { ProcessBodyParams } from "../helpers/renderer.js";
import { BaseCategoryArgs, BaseCategoryErrorResponse, BaseCategoryResponse } from "../types/index.js";
import { RequestBase } from "./request.js";
export declare abstract class CategoryBase<C extends BaseCategoryArgs, T extends BaseCategoryResponse<Record<string, unknown>>> {
    abstract fetchCategory(args: C): Promise<T | BaseCategoryErrorResponse>;
    abstract getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
}
export declare class BaseClass extends RequestBase implements CategoryBase<BaseCategoryArgs, BaseCategoryResponse> {
    fetchCategory(_args: BaseCategoryArgs): Promise<BaseCategoryResponse<Record<string, unknown>> | BaseCategoryErrorResponse>;
    getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
}
//# sourceMappingURL=categories.d.ts.map