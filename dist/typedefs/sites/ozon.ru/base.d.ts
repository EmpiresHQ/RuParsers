import { BaseRequestParameters, ProxyType, SimpleCookie } from "../../types/index.js";
import { BaseResponseData } from "./types.js";
export type Fetcher<T = BaseResponseData> = (opts: Omit<BaseRequestParameters, "cookies"> & {
    cookies: SimpleCookie[];
}) => Promise<T>;
export type CookieLoader = (proxy: ProxyType) => Promise<SimpleCookie[] | undefined>;
export interface ItemProcessorOpts<T> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
}
export interface BaseFetcherArgs {
    preloadedCookies?: SimpleCookie[];
    proxy: ProxyType;
}
export declare abstract class OzonBase<T = BaseResponseData> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
    endpoint: string;
    constructor({ fetcher, cookieLoader }: ItemProcessorOpts<T>);
    getCookies({ proxy, preloadedCookies }: BaseFetcherArgs): Promise<SimpleCookie[] | undefined>;
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
    request({ opts: { proxy }, cookies, pathLoader, }: {
        opts: Omit<BaseFetcherArgs, "preloadedCookies">;
        cookies: SimpleCookie[];
        pathLoader: () => {
            args: string[];
            nextUrl?: string;
        };
    }): Promise<T>;
}
//# sourceMappingURL=base.d.ts.map