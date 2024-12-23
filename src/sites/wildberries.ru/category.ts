import {
  BaseFetcherArgs,
  CategoryBase,
  RequestBase,
} from "../../base/index.js";
import { ProcessBodyParams } from "../../helpers/renderer.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../../types/index.js";
import { ResponseWbCategory } from "./index.js";
import { categoryProcessor } from "./parsers/category_response.js";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: string;
  categoryUrl?: string;
  shard: string;
  key?: string;
  page?: number;
}

export class CategoryProcessor
  extends RequestBase<ResponseWbCategory>
  implements CategoryBase<FetchCategoryArgs, BaseCategoryResponse>
{
  public getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy"> {
    return {};
  }

  async fetchCategory({
    categoryId,
    shard,
    key="cat",
    // preloadedCookies,
    // proxy,
    page = 1,
  }: FetchCategoryArgs): Promise<
    BaseCategoryResponse | BaseCategoryErrorResponse
  > {
    // const { cookies, headers } = await this.getCookies({
    //   preloadedCookies,
    //   proxy,
    // });

    // if (!cookies) {
    //   throw new Error("could not fetch cookies");
    // }

    const { data } = await this.fetcher({
      urlPath:
        page > 1
          ? `/catalog/${
              shard
            }/catalog?ab_testing=false&appType=64&${key}=${categoryId}&curr=rub&dest=-1255563&lang=ru&locale=ru&spp=30&page=${page}`
          : `/catalog/${shard}/catalog?ab_testing=false&appType=64&${key}=${categoryId}&curr=rub&dest=-1255563&lang=ru&locale=ru&spp=30`,
      cookies: [],
      method: "GET",
    });
    if (data) {
      const parsed = await categoryProcessor(data);
      if ("err" in parsed) {
        return { err: parsed.err };
      }
      if (parsed.items) {
        return {
          items: parsed.items,
          hasNextPage: parsed.hasNextPage,
        };
      }
    }

    return {
      err: undefined,
    };
  }
}
