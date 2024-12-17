import {
  BaseFetcherArgs,
  CategoriesBase,
  RequestBase,
} from "../../base/index.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../../types/index.js";
import { Page, API_HOST, API_SETTINGS, apiParser } from "./index.js";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: number;
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
  }: FetchCategoryArgs): Promise<
    BaseCategoryResponse | BaseCategoryErrorResponse
  > {
    const { cookies, headers } = await this.getCookies({
      preloadedCookies,
      proxy,
    });

    const acctoken = cookies?.find(({ name }) => name === "acctoken");
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }

    const data = await this.fetcher({
      urlPath: `/api/category/load?short=true`,
      host: API_HOST,
      method: "POST",
      timeout: 15,
      cookies,
      proxy,
      headers: [
        "Content-Type: application/json",
        `Token: ${acctoken?.value}`,
      ],
      payload: {
        listingType: "category",
        id: categoryId,
        page: {
          number: page,
          perPage: API_SETTINGS.perPage,
        },
      },
    });
    if (data) {
      const parsed = await apiParser({ json: data });
      if (parsed && parsed.items) {
        return {
          items: parsed.items,
          cookiesHeaders: { cookies, headers },
          hasNextPage: parsed.hasNextPage,
        };
      }
    }

    return {
      err: undefined,
    };
  }
}
