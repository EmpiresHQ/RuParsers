import { BaseFetcherArgs, CategoriesBase } from "../../base/index.js";
import { RequestBase } from "../../base/index.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../../types/index.js";
import { apiParser } from "./category_parser.js";
import { Page } from "./index.js";
import { API_HOST } from "./settings.js";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: string;
  categoryUrl?: string;
  page?: number;
}

export class CategoryProcessor
  extends RequestBase<Page>
  implements CategoriesBase<FetchCategoryArgs, BaseCategoryResponse>
{
  async fetchCategory({
    categoryId,
    preloadedCookies,
    proxy,
    page = 1,
  }: FetchCategoryArgs): Promise<BaseCategoryResponse | BaseCategoryErrorResponse> {
    const { cookies, headers } = await this.getCookies({
      preloadedCookies,
      proxy,
    });
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }

    const data = await this.fetcher({
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
    if (data) {
      const parsed = await apiParser({ json: data });
      if (parsed && parsed.items) {
        return {
          items: parsed.items,
          cookiesHeaders: { cookies, headers},
          hasNextPage: parsed.hasNextPage,
        }
      }
    }

    return {
      err: undefined,
    };
  }
}
