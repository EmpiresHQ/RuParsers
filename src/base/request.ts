import { BaseCookieResponse, CookieLoader, Fetcher, ProxyType, RequestBaseProcessorOpts } from "../types/index.js";

export interface BaseFetcherArgs {
  preloadedCookies?: BaseCookieResponse;
  proxy: ProxyType;
}

export class RequestBase<T = unknown> {
  public fetcher: Fetcher<T>;
  public cookieLoader: CookieLoader;

  constructor({ fetcher, cookieLoader }: RequestBaseProcessorOpts<T>) {
    this.fetcher = fetcher;
    this.cookieLoader = cookieLoader;
  }

  public async getCookies({ proxy, preloadedCookies }: BaseFetcherArgs): Promise<BaseCookieResponse> {
    if (preloadedCookies) {
      return preloadedCookies;
    }
    const data = await this.cookieLoader(proxy);
    return data;
  }
}