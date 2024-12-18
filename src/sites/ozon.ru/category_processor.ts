import { CategoryBase } from "../../base/index.js";
import {
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../../types/index.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";
import { categoryItemsParser } from "./parsers/search_results_v2.js";
import {
  CategoryParsedData,
  CategoryResponseData,
  ResponseOzonItem,
} from "./types.js";

export interface FetchCategoryArgs extends BaseFetcherArgs {
  categoryId: string;
  categoryUrl?: string;
  page?: number;
}

export interface ProcessCategoryResponse
  extends BaseCategoryResponse<ResponseOzonItem> {}

export class OzonCategoryProcessor
  extends OzonBase<CategoryResponseData>
  implements CategoryBase<FetchCategoryArgs, ProcessCategoryResponse>
{
  async fetchCategory({
    categoryId,
    categoryUrl,
    preloadedCookies,
    proxy,
    page = 1,
  }: FetchCategoryArgs): Promise<
    ProcessCategoryResponse | BaseCategoryErrorResponse
  > {
    // eslint-disable-next-line prefer-const
    let { cookies, headers } = await this.getCookies({ preloadedCookies, proxy });
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }
    const data = await this.request({
      opts: { proxy },
      cookiesHeaders: { cookies },
      pathLoader: () => ({
        args: [categoryId, page.toString()],
        nextUrl: categoryUrl,
      }),
      cookieCallback: (ccks => {
        cookies = ccks;
      })
    });
    const parsed = this.process(data);
    return {
      ...parsed,
      cookiesHeaders: {
        cookies,
        headers
      },
    };
  }

  public getPath({ args, nextUrl }: { args: string[]; nextUrl?: string }) {
    if (nextUrl) {
      return encodeURIComponent(nextUrl);
    }
    const pagePart =
      +args[1] > 1
        ? `?layout_container=categorySearchMegapagination&layout_page_index=${args[1]}&page=${args[1]}`
        : "";
    return encodeURIComponent(`/category/${args[0]}/${pagePart}`);
  }
  public process(
    data: CategoryResponseData
  ): ProcessCategoryResponse | BaseCategoryErrorResponse {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return { err: errChecker.err };
    }
    const parsed = this.stateParser<CategoryParsedData>(data);

    let items: ResponseOzonItem[] = [];
    if (parsed.searchResultsV2) {
      items = categoryItemsParser(parsed.searchResultsV2);
    }

    const nextPage = data?.nextPage ?? parsed?.megaPaginator?.nextPage;
    return {
      hasNextPage: !!(nextPage && nextPage.indexOf("sold_out_page") < 0),
      items,
      nextPage,
    };
  }

  public filterStates(): string[] {
    return [
      "searchResultsV2",
      "tagList",
      "filtersDesktop",
      "ResultsHeader",
      "tileGrid2",
      "skuGrid2",
      "userAdultModal",
      "megaPaginator",
      "no_results",
    ];
  }
}
