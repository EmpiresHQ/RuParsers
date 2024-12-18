import { CookieHeaders } from "../helpers/curl.js";
import { ProcessBodyParams } from "../helpers/renderer.js";
import { BaseCookieResponse, CookieLoader, Fetcher, ProxyType, RequestBaseProcessorOpts, SimpleCookie } from "../types/index.js";
export interface BaseFetcherArgs {
    preloadedCookies?: BaseCookieResponse;
    proxy: ProxyType;
}
export declare abstract class RequestBase<T = unknown> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
    constructor({ fetcher, cookieLoader }: RequestBaseProcessorOpts<T>);
    abstract getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">;
    readCookies({ headers, existing, merge, }: {
        headers: CookieHeaders;
        existing?: SimpleCookie[];
        merge?: boolean;
    }): SimpleCookie[] | undefined;
    private parseSetCookieHeader;
    getCookies({ proxy, preloadedCookies, }: BaseFetcherArgs): Promise<BaseCookieResponse>;
}
//# sourceMappingURL=request.d.ts.map