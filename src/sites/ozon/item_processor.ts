import { merge } from "lodash";
import {
  BaseRequestParameters,
  ProxyType,
  SimpleCookie,
} from "../../types/index.js";
import {
  ItemParsedData,
  ItemResponseData,
  OzonItemPrice,
  ResponseOzonItem,
} from "./types.js";

export type Fetcher<T = ItemResponseData> = (
  opts: Omit<BaseRequestParameters, "cookies"> & { cookies: SimpleCookie[] }
) => Promise<T>;
export type CookieLoader = (proxy: ProxyType) => SimpleCookie[];

export interface ItemProcessorOpts<T> {
  fetcher: Fetcher<T>;
  cookieLoader: CookieLoader;
}

interface FetchItemArgs {
  itemId: string;
  preloadedCookies?: SimpleCookie[];
  proxy: ProxyType;
}

export class OzonItemProcessor {
  private fetcher: Fetcher;
  private cookieLoader: CookieLoader;
  private endpoint =
    "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";

  constructor({ fetcher, cookieLoader }: ItemProcessorOpts<ItemResponseData>) {
    this.fetcher = fetcher;
    this.cookieLoader = cookieLoader;
  }

  async fetchItem({ itemId, preloadedCookies, proxy }: FetchItemArgs) {
    const cookies = await this._getCookies({ preloadedCookies, proxy });
    const data = await this.itemRequest({
      opts: { itemId, proxy },
      cookies,
    });
    const parsed = this.process(data);
    return parsed;
  }

  public getPath(itemId: string) {
    return encodeURIComponent(`/product/${itemId}`);
  }

  private async itemRequest({
    opts: { itemId, proxy },
    cookies,
  }: {
    opts: Omit<FetchItemArgs, "preloadedCookies">;
    cookies: SimpleCookie[];
  }) {
    const data = await this.fetcher({
      method: "GET",
      proxy,
      cookies,
      host: this.endpoint,
      urlPath: this.getPath(itemId),
    });
    return data;
  }

  private async _getCookies({
    proxy,
    preloadedCookies,
  }: Omit<FetchItemArgs, "itemId">) {
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

  public process(data: ItemResponseData): { err?: unknown; item?: unknown } {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return { err: errChecker.err };
    }

    const parsed = this.stateParser<ItemParsedData>(data);

    if (parsed.userAdultModal) {
      return {
        err: "adult",
      };
    }
    // console.log(resp.url)
    // console.log(parsed.tileGrid2);
    // console.log(JSON.stringify(parsed.searchResultsV2, null ,2));

    // const items = categoryItemsParser(parsed.searchResultsV2);
    let item: ResponseOzonItem | undefined = undefined;
    if (parsed.webOutOfStock) {
      item = {
        isAvailable: false,
        skuId: parsed.webOutOfStock.sku,
        regularPrice: "",
      };
    }
    if (parsed["webPrice-"]) {
      item = this.itemParser({
        webPrice: parsed["webPrice-"],
        sku: parsed.webReviewProductScore
          ? parsed.webReviewProductScore.itemId.toString()
          : parsed.webProductMainWidget
            ? parsed.webProductMainWidget.sku
            : parsed.webAddToFavorite.sku,
      });
    }
    // throw "die";
    return {
      item,
    };
  }

  public itemParser({
    webPrice,
    sku,
  }: {
    webPrice: OzonItemPrice;
    sku: string;
  }): ResponseOzonItem {
    return {
      skuId: sku,
      discountPrice: webPrice.cardPrice,
      regularPrice: webPrice.originalPrice,
      isAvailable: webPrice.isAvailable,
    };
  }

  public filterStates() {
    return [
      "webPrice-",
      "userAdultModal",
      "webReviewProductScore",
      "webOutOfStock",
      "webProductMainWidget",
      "webAddToFavorite",
    ];
  }
}
