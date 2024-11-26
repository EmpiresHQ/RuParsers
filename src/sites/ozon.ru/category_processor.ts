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

export class OzonCategoryProcessor extends OzonBase<CategoryResponseData> {
  async fetchCategory({
    categoryId,
    categoryUrl,
    preloadedCookies,
    proxy,
    page = 1,
  }: FetchCategoryArgs) {
    const cookies = await this.getCookies({ preloadedCookies, proxy });
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }
    const data = await this.request({
      opts: { proxy },
      cookies,
      pathLoader: () => ({
        args: [categoryId, page.toString()],
        nextUrl: categoryUrl,
      }),
    });
    const parsed = this.process(data);
    return {
      ...parsed,
      cookies,
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
  public process(data: CategoryResponseData): {
    err?: unknown;
    items?: unknown;
    hasNextPage?: boolean;
    nextPage?: string;
  } {
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
