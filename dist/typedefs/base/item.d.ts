import { ProcessBodyParams } from "../helpers/renderer.js";
import { BaseCategoryErrorResponse, BaseItemArgs, BaseItemResponse } from "../types/index.js";
import { RequestBase } from "./request.js";
export declare abstract class ItemBase<C extends BaseItemArgs, T extends BaseItemResponse<Record<string, unknown>>> {
    abstract fetchItem(args: C): Promise<T | BaseCategoryErrorResponse>;
}
export declare class BaseClass extends RequestBase implements ItemBase<BaseItemArgs, BaseItemResponse> {
    fetchItem(_args: BaseItemArgs): Promise<BaseItemResponse<Record<string, unknown>> | BaseCategoryErrorResponse>;
    getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
}
//# sourceMappingURL=item.d.ts.map