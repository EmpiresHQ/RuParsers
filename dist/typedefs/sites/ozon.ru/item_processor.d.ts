import { BaseResponseData, OzonItemPrice, ResponseOzonItem } from "./types.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";
import { BaseCookieResponse } from "../../types/index.js";
export interface FetchItemArgs extends BaseFetcherArgs {
    itemId: string;
}
export interface FetchItemResponse {
    err?: string;
    cookiesHeaders?: BaseCookieResponse;
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