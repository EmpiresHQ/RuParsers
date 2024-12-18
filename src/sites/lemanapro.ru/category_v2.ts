import { BaseFetcherArgs, CategoryBase } from "../../base/index.js";
import { RequestBase } from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
  SimpleCookie,
} from "../../types/index.js";
import { apiParser } from "./category_parser.js";
import { Page } from "./index.js";
import { API_HOST, API_SETTINGS } from "./settings.js";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: string;
  categoryUrl?: string;
  page?: number;
}

export class CategoryProcessor
  extends RequestBase<Page>
  implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse>
{
  public getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy"> {
    return {
      ...API_SETTINGS.antibotOpts,
    };
  }
  async fetchCategory({
    categoryId,
    preloadedCookies,
    proxy,
    page = 1,
  }: FetchCategoryArgs): Promise<
    BaseCategoryResponse | BaseCategoryErrorResponse
  > {
    // eslint-disable-next-line prefer-const
    let { cookies, headers } = await this.getCookies({
      preloadedCookies,
      proxy,
    });
    headers ??= {};
    headers.token = "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv";
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }

    const { data, headers: rcvHeaders } = await this.fetcher({
      method: "POST",
      host: API_HOST,
      urlPath: `/hybrid/v1/getProducts?lang=ru`,
      proxy,
      headers: [
        "Content-Type: application/json",
        `x-api-key: ${headers?.token}`,
      ],
      cookies,
      payload: {
        familyIds: [categoryId ?? ""],
        regionId: "34",
        suggest: true,
        limit: 30,
        offset: page * 30,
      },
    });
    let newCookies: SimpleCookie[] | undefined
    if (rcvHeaders) {
      newCookies = this.readCookies({headers: rcvHeaders, existing: cookies})
    }
    
    if (data) {
      const parsed = await apiParser({ json: data });
      if (parsed && parsed.items) {
        return {
          items: parsed.items,
          cookiesHeaders: { cookies: newCookies ?? cookies, headers },
          hasNextPage: parsed.hasNextPage,
        };
      }
    }

    return {
      err: undefined,
    };
  }
}
