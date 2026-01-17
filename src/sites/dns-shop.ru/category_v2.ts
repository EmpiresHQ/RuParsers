import {
  BaseFetcherArgs,
  CategoryBase,
  RequestBase,
} from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import { BaseProcessorError } from "../../types/error.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
  SimpleCookie,
} from "../../types/index.js";
import { apiParser } from "./category_parser.js";
import {
  AjaxState,
  API_SETTINGS,
  CategoryResponse,
  ImageResponse,
  PricePayload,
  PriceResponse,
  WEB_HOST,
  WindowDNS,
} from "./index.js";
import * as vm from "node:vm";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: number | string;
  categoryUrl?: string;
  page?: number;
}

export class CategoryProcessor
  extends RequestBase<CategoryResponse>
  implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse>
{
  public getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy"> {
    return {
      ...API_SETTINGS.antibotOpts,
    };
  }

  async fetchCategory({
    categoryUrl,
    preloadedCookies,
    proxy,
    page = 1,
  }: FetchCategoryArgs): Promise<
    BaseCategoryResponse | BaseCategoryErrorResponse
  > {
    if (!categoryUrl) {
      throw new Error("no category url");
    }
    const { cookies, headers } = await this.getCookies({
      preloadedCookies,
      proxy,
    });

    if (!cookies) {
      throw new Error("could not fetch cookies");
    }

    const { data } = await this.fetcher({
      urlPath:
        categoryUrl.indexOf("virtual_category_uid") > -1
          ? page > 0
            ? `${categoryUrl ?? ""}&p=${page}`
            : `${categoryUrl ?? ""}`
          : `${categoryUrl ?? ""}/?p=${page}`,
      host: WEB_HOST,
      method: "GET",
      timeout: 15,
      cookies,
      proxy,
      headers: [
        "Content-Type: application/json",
        `cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5`,
        `x-requested-with: XMLHttpRequest`,
      ],
    });
    if (data) {
      if (typeof data !== "object" || !data.assets || !data.assets.inlineJs) {
        return {
          err: BaseProcessorError.NotFound,
        };
      }
      const productContainer = Object.entries(data.assets.inlineJs).find(
        ([, value]) => {
          return value.includes("AjaxState.register");
        }
      );
      if (!productContainer) {
        return {
          items: [],
        };
      }
      const productsString = data.assets.inlineJs[productContainer[0]];

      let store: AjaxState | undefined = [];
      const ctx: WindowDNS = {
        window: {
          AjaxState: {
            register: (data) => {
              store = data as AjaxState;
            },
          },
        },
      };
      vm.createContext(ctx);
      vm.runInContext(productsString, ctx);
      if (!store || !store.length) {
        // return {
        //   error: "notparsed",
        // };
        return {
          items: [],
        };
      }
      const chunk = store.find((chunk) => chunk[0].type === "product-buy");
      if (!chunk && (!page || page == 1)) {
        return {
          err: BaseProcessorError.NotFound,
        };
      }
      if (!chunk || chunk.length < 2) {
        // return {
        //   error: "noproducts",
        // };
        return {
          items: [],
        };
      }
      const pricePayload = chunk[1].map(({ id, data: { id: dId } }) => ({
        id,
        data: { id: dId },
      }));
      const priceData = await this.fetchPrices(pricePayload, cookies);
      const productIds = priceData.data.states.map((state) => state.data.id);
      const imageData = await this.fetchImages(productIds, cookies);
      const unparsed = priceData.data.states.map((state) => ({
        ...state,
        images: imageData.data[state.data.id],
      }));

      const parsed = await apiParser({ json: unparsed });
      if ("err" in parsed) {
        return { err: parsed.err };
      }
      if (parsed.items) {
        const items = parsed.items;
        return {
          ...parsed,
          items,
          cookiesHeaders: {
            cookies, headers
          }
        };
      }
    }

    return {
      err: undefined,
    };
  }

  public async fetchImages(productIds: string[], cookies: SimpleCookie[]) {
    const { data: respData } = await this.untypedFetcher<ImageResponse>({
      urlPath: `/catalog/product/get-images/`,
      host: WEB_HOST,
      method: "POST",
      headers: [
        "Content-Type: application/x-www-form-urlencoded",
        "accept: */*",
        `x-requested-with: XMLHttpRequest`,
      ],
      raw: `ids=${JSON.stringify(productIds)}`,
      cookies,
    });
    return respData;
  }

  public async fetchPrices(pl: PricePayload[], cookies: SimpleCookie[]) {
    const data = { type: "product-buy", containers: pl };
    const { data: respData } = await this.untypedFetcher<PriceResponse>({
      urlPath: `/ajax-state/product-buy/`,
      host: WEB_HOST,
      method: "POST",
      headers: [
        "Content-Type: application/x-www-form-urlencoded",
        "accept: */*",
        `x-requested-with: XMLHttpRequest`,
      ],
      raw: `data=${JSON.stringify(data)}`,
      cookies,
    });
    return respData;
  }
}
