// import { merge } from "lodash";
import lodash from 'lodash';
 const { merge } = lodash;
import {
  BaseRequestParameters,
  ProxyType,
  SimpleCookie,
} from "../../types/index.js";
import { BaseResponseData } from "./types.js";

export type Fetcher<T = BaseResponseData> = (
  opts: Omit<BaseRequestParameters, "cookies"> & { cookies: SimpleCookie[] }
) => Promise<T>;
export type CookieLoader = (
  proxy: ProxyType
) => Promise<SimpleCookie[] | undefined>;

export interface ItemProcessorOpts<T> {
  fetcher: Fetcher<T>;
  cookieLoader: CookieLoader;
}

export interface BaseFetcherArgs {
  preloadedCookies?: SimpleCookie[];
  proxy: ProxyType;
}

export abstract class OzonBase<T = BaseResponseData> {
  public fetcher: Fetcher<T>;
  public cookieLoader: CookieLoader;
  public endpoint =
    "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";

  constructor({ fetcher, cookieLoader }: ItemProcessorOpts<T>) {
    this.fetcher = fetcher;
    this.cookieLoader = cookieLoader;
  }

  public async getCookies({ proxy, preloadedCookies }: BaseFetcherArgs) {
    if (preloadedCookies) {
      return preloadedCookies;
    }
    return this.cookieLoader(proxy);
  }

  public checkError(data: BaseResponseData) {
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
  public stateParser<C extends { [key in string]: unknown }>(
    data: BaseResponseData
  ): C {
    const keys = Object.keys(data.widgetStates).filter((k) =>
      this.filterStates().find((s) => k.indexOf(s) > -1)
    );
    // console.log(data.widgetStates)

    const parsed = keys.reduce<C>((sum, k) => {
      const key = this.filterStates().find((f) => k.indexOf(f) > -1) ?? "";
      return {
        ...sum,
        ...{
          [key]: sum[key]
            ? merge(sum[key], JSON.parse(data.widgetStates[k]))
            : JSON.parse(data.widgetStates[k]),
        },
      };
    }, {} as C);

    return parsed;
  }

  public abstract getPath({
    args,
    nextUrl,
  }: {
    args: string[];
    nextUrl?: string;
  }): string;

  public abstract filterStates(): string[];

  public async request({
    opts: { proxy },
    cookies,
    pathLoader,
  }: {
    opts: Omit<BaseFetcherArgs, "preloadedCookies">;
    cookies: SimpleCookie[];
    pathLoader: () => { args: string[]; nextUrl?: string };
  }): Promise<T> {
    const path = this.getPath(pathLoader());
    const data = await this.fetcher({
      method: "GET",
      proxy,
      cookies,
      host: this.endpoint,
      urlPath: path,
    });
    return data as T;
  }
}
