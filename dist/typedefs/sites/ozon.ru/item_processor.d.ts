import { BaseResponseData, OzonItemPrice, ResponseOzonItem } from "./types.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";
import { SimpleCookie } from "../../types/base.js";
export interface FetchItemArgs extends BaseFetcherArgs {
    itemId: string;
}
export interface FetchItemResponse {
    err?: string;
    cookies?: SimpleCookie[];
    item?: ResponseOzonItem;
}
export declare class OzonItemProcessor extends OzonBase {
    fetchItem({ itemId, preloadedCookies, proxy, }: FetchItemArgs): Promise<FetchItemResponse>;
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