// import { merge } from "lodash";
import lodash from "lodash";
const { merge } = lodash;
import {
  BaseCookieResponse,
  CookieLoader,
  Fetcher,
  ProxyType,
  SimpleCookie,
} from "../../types/index.js";
import { BaseResponseData } from "./types.js";
import { RequestBase } from "../../base/request.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";

export interface ItemProcessorOpts<T> {
  fetcher: Fetcher<T>;
  cookieLoader: CookieLoader;
}

export interface BaseFetcherArgs {
  preloadedCookies?: BaseCookieResponse;
  proxy: ProxyType;
}

export abstract class OzonBase<T = BaseResponseData>
  extends RequestBase<T>
  implements RequestBase<T>
{
  public endpoint =
    "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";

  constructor(args: ItemProcessorOpts<T>) {
    super(args);
  }

  public getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy"> {
    return {
      url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/category/7000`)})`,
      waitAfterLoad: 4000,
      getDocumentBody: true,
      fetchCookies: {
        domains: ["https://www.ozon.ru"],
        cookieNames: ["abt_data", "__Secure-ETC", "TS01*"],
      },
    };
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
    cookieCallback,
  }: {
    opts: Omit<BaseFetcherArgs, "preloadedCookies">;
    cookiesHeaders: BaseCookieResponse;
    pathLoader: () => { args: string[]; nextUrl?: string };
    cookieCallback?: ( cookies: SimpleCookie[]) => void;
  }): Promise<T> {
    const path = this.getPath(pathLoader());
    const { data, headers } = await this.fetcher({
      method: "GET",
      proxy,
      cookies: cookies ? cookies : [],
      host: this.endpoint,
      urlPath: path,
      version: "V2Tls",
      headers: [
        "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        `Sec-Fetch-Dest: document`,
        "Sec-Fetch-Mode: navigate",
        "Sec-Fetch-Site: cross-site",
        `Sec-ch-ua-platform: "Linux"`,
      ],
    });
    if (headers) {
      const readCookies = this.readCookies({headers, existing: cookies})
      if (readCookies && cookieCallback) {
        cookieCallback(readCookies)
      }
    }
    return data as T;
  }
}
