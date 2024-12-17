import { BaseCookieResponse, CookieLoader, Fetcher, ProxyType, RequestBaseProcessorOpts } from "../types/index.js";
export interface BaseFetcherArgs {
    preloadedCookies?: BaseCookieResponse;
    proxy: ProxyType;
}
export declare class RequestBase<T = unknown> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
    constructor({ fetcher, cookieLoader }: RequestBaseProcessorOpts<T>);
    getCookies({ proxy, preloadedCookies }: BaseFetcherArgs): Promise<BaseCookieResponse>;
}
//# sourceMappingURL=request.d.ts.map