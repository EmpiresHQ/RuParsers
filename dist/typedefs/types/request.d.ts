import { BaseFetcherArgs } from "../base/request.js";
import { BaseItem, BaseRequestParameters, ProxyType, SimpleCookie } from "./index.js";
export interface BaseCategoryArgs extends BaseFetcherArgs {
    categoryId: string | number;
    categoryUrl?: string;
    page?: number;
}
export interface RequestBaseProcessorOpts<T> {
    fetcher: Fetcher<T>;
    cookieLoader: CookieLoader;
}
export type BaseCategoryErrorResponse = {
    err: unknown;
    cookies?: SimpleCookie[];
};
export interface BaseCategoryResponse<T extends Record<string, unknown> = Record<string, unknown>> {
    cookiesHeaders?: BaseCookieResponse;
    items: BaseItem<T>[];
    hasNextPage?: boolean;
    nextPage?: string;
}
export type BaseCookieResponse = {
    cookies?: SimpleCookie[];
    headers?: Record<string, string | undefined>;
};
export type Fetcher<T> = (opts: Omit<BaseRequestParameters, "cookies"> & {
    cookies: SimpleCookie[];
}) => Promise<T>;
export type CookieLoader = (proxy: ProxyType) => Promise<BaseCookieResponse>;
//# sourceMappingURL=request.d.ts.map