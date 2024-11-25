import { BaseRequestParameters, ProxyType, SimpleCookie } from "../../types/index.js";
import { ItemResponseData, OzonItemPrice, ResponseOzonItem } from "./types.js";
export type Fetcher<T = ItemResponseData> = (opts: Omit<BaseRequestParameters, "cookies"> & {
    cookies: SimpleCookie[];
}) => Promise<T>;
export type CookieLoader = (proxy: ProxyType) => SimpleCookie[];
export interface ItemProcessorOpts<T> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
}
interface FetchItemArgs {
    itemId: string;
    preloadedCookies?: SimpleCookie[];
    proxy: ProxyType;
}
export declare class OzonItemProcessor {
    private fetcher;
    private cookieLoader;
    private endpoint;
    constructor({ fetcher, cookieLoader }: ItemProcessorOpts<ItemResponseData>);
    fetchItem({ itemId, preloadedCookies, proxy }: FetchItemArgs): Promise<{
        err?: unknown;
        item?: unknown;
    }>;
    getPath(itemId: string): string;
    private itemRequest;
    private _getCookies;
    checkError(data: ItemResponseData): {
        err: string;
        ok?: undefined;
    } | {
        ok: boolean;
        err?: undefined;
    };
    stateParser<T extends {
        [key in string]: unknown;
    }>(data: ItemResponseData): T;
    process(data: ItemResponseData): {
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