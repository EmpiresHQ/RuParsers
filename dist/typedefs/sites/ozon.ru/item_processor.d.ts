import { BaseResponseData, OzonItemPrice, ResponseOzonItem } from "./types.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";
interface FetchItemArgs extends BaseFetcherArgs {
    itemId: string;
}
export declare class OzonItemProcessor extends OzonBase {
    fetchItem({ itemId, preloadedCookies, proxy }: FetchItemArgs): Promise<{
        cookies: import("../../types/base.js").SimpleCookie[];
        err?: unknown;
        item?: unknown;
    }>;
    getPath({ args }: {
        args: string[];
    }): string;
    process(data: BaseResponseData): {
        err?: unknown;
        item?: unknown;
    };
    itemParser({ webPrice, sku, }: {
        webPrice: OzonItemPrice;
        sku: string;
    }): ResponseOzonItem;
    filterStates(): string[];
}
export {};
//# sourceMappingURL=item_processor.d.ts.map