import { BaseResponseData, OzonItemPrice, ResponseOzonItem } from "./types.js";
import { OzonBase } from "./base.js";
import { BaseItemArgs, BaseItemResponse } from "../../types/index.js";
import { ItemBase } from "../../base/index.js";
export interface FetchItemResponse extends BaseItemResponse {
    item?: ResponseOzonItem;
}
export declare class OzonItemProcessor extends OzonBase implements ItemBase<BaseItemArgs, FetchItemResponse> {
    fetchItem({ itemId, preloadedCookies, proxy, }: BaseItemArgs): Promise<FetchItemResponse>;
    getPath({ args }: {
        args: string[];
    }): string;
    process(data: BaseResponseData): FetchItemResponse;
    itemParser({ webPrice, sku, }: {
        webPrice: OzonItemPrice;
        sku: string;
    }): ResponseOzonItem;
    filterStates(): string[];
}
//# sourceMappingURL=item_processor.d.ts.map