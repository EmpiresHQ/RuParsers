import { BaseCookieResponse, CookieLoader, Fetcher, ProxyType } from "../../types/index.js";
import { BaseResponseData } from "./types.js";
import { RequestBase } from "../../base/request.js";
export interface ItemProcessorOpts<T> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
}
export interface BaseFetcherArgs {
    preloadedCookies?: BaseCookieResponse;
    proxy: ProxyType;
}
export declare abstract class OzonBase<T = BaseResponseData> extends RequestBase<T> {
    endpoint: string;
    constructor(args: ItemProcessorOpts<T>);
    checkError(data: BaseResponseData): {
        err: string;
        ok?: undefined;
    } | {
        ok: boolean;
        err?: undefined;
    };
    stateParser<C extends {
        [key in string]: unknown;
    }>(data: BaseResponseData): C;
    abstract getPath({ args, nextUrl, }: {
        args: string[];
        nextUrl?: string;
    }): string;
    abstract filterStates(): string[];
    request({ opts: { proxy }, cookiesHeaders: { cookies }, pathLoader, }: {
        opts: Omit<BaseFetcherArgs, "preloadedCookies">;
        cookiesHeaders: BaseCookieResponse;
        pathLoader: () => {
            args: string[];
            nextUrl?: string;
        };
    }): Promise<T>;
}
//# sourceMappingURL=base.d.ts.map