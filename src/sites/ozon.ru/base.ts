// import { merge } from "lodash";
import lodash from "lodash";
const { merge } = lodash;
import {
  BaseCookieResponse,
  CookieLoader,
  Fetcher,
  ProxyType,
} from "../../types/index.js";
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

export abstract class OzonBase<T = BaseResponseData> extends RequestBase<T> {
  public endpoint =
    "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";

  constructor(args: ItemProcessorOpts<T>) {
    super(args);
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
    cookiesHeaders: { cookies },
    pathLoader,
  }: {
    opts: Omit<BaseFetcherArgs, "preloadedCookies">;
    cookiesHeaders: BaseCookieResponse;
    pathLoader: () => { args: string[]; nextUrl?: string };
  }): Promise<T> {
    const path = this.getPath(pathLoader());
    const data = await this.fetcher({
      method: "GET",
      proxy,
      cookies: cookies ? cookies : [],
      host: this.endpoint,
      urlPath: path,
    });
    return data as T;
  }
}
