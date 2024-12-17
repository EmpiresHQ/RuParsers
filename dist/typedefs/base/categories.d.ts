import { BaseCategoryArgs, BaseCategoryErrorResponse, BaseCategoryResponse } from "../types/index.js";
import { RequestBase } from "./index.js";
export declare abstract class CategoriesBase<C extends BaseCategoryArgs, T extends BaseCategoryResponse<Record<string, unknown>>> {
    abstract fetchCategory(args: C): Promise<T | BaseCategoryErrorResponse>;
}
export declare class BaseClass extends RequestBase implements CategoriesBase<BaseCategoryArgs, BaseCategoryResponse> {
    fetchCategory(_args: BaseCategoryArgs): Promise<BaseCategoryResponse<Record<string, unknown>> | BaseCategoryErrorResponse>;
}
//# sourceMappingURL=categories.d.ts.map