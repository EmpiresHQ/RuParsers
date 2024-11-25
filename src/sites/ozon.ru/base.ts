import { merge } from "lodash";
import { BaseRequestParameters, ProxyType, SimpleCookie } from "../../types/index.js";
import { ItemResponseData } from "./types.js";

export type Fetcher<T = ItemResponseData> = (
  opts: Omit<BaseRequestParameters, "cookies"> & { cookies: SimpleCookie[] }
) => Promise<T>;
export type CookieLoader = (proxy: ProxyType) => Promise<SimpleCookie[] | undefined>;

export interface ItemProcessorOpts<T> {
  fetcher: Fetcher<T>;
  cookieLoader: CookieLoader;
}

export interface BaseFetcherArgs {
  preloadedCookies?: SimpleCookie[];
  proxy: ProxyType; 
}

export abstract class OzonBase {
  public fetcher: Fetcher;
  public cookieLoader: CookieLoader;
  public endpoint =
    "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";

  
  constructor({ fetcher, cookieLoader }: ItemProcessorOpts<ItemResponseData>) {
    this.fetcher = fetcher;
    this.cookieLoader = cookieLoader;
  }

  public async getCookies({
    proxy,
    preloadedCookies,
  }: BaseFetcherArgs) {
    if (preloadedCookies) {
      return preloadedCookies;
    }
    return this.cookieLoader(proxy);
  }

  public checkError(data: ItemResponseData) {
    if (
      !data ||
      data.incidentId ||
      data.pageInfo?.pageType === "error" ||
      !data.widgetStates
    ) {
      if (data.incidentId) {
        console.log("challenge: ", data.challengeURL);
        console.log("incident: ", data.incidentId);
        console.log(data);
      }

      return {
        err: data.incidentId ? "crawler" : "notfound",
      };
    }
    return { ok: true };
  }
  public stateParser<T extends { [key in string]: unknown }>(
    data: ItemResponseData
  ): T {
    const keys = Object.keys(data.widgetStates).filter((k) =>
      this.filterStates().find((s) => k.indexOf(s) > -1)
    );
    // console.log(data.widgetStates)

    const parsed = keys.reduce<T>((sum, k) => {
      const key = this.filterStates().find((f) => k.indexOf(f) > -1) ?? "";
      return {
        ...sum,
        ...{
          [key]: sum[key]
            ? merge(sum[key], JSON.parse(data.widgetStates[k]))
            : JSON.parse(data.widgetStates[k]),
        },
      };
    }, {} as T);

    return parsed;
  }

  public abstract getPath(...args: string[]): string;

  public abstract filterStates(): string[];

  public async itemRequest({
    opts: { proxy },
    cookies,
    pathLoader
  }: {
    opts: Omit<BaseFetcherArgs, "preloadedCookies">;
    cookies: SimpleCookie[];
    pathLoader: () => string[];
  }) {
    const path = this.getPath(...pathLoader())
    const data = await this.fetcher({
      method: "GET",
      proxy,
      cookies,
      host: this.endpoint,
      urlPath: path,
    });
    return data;
  } 
}

