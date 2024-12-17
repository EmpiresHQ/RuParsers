// import { flatten } from "lodash";
import lodash from "lodash";
const { flatten } = lodash;
import {
  FetchCategoryArgs,
  OzonCategoryProcessor,
  ProcessCategoryResponse,
} from "./category_processor.js";
import { CategoryParsedData, CategoryResponseData } from "./types.js";
import { sleeper } from "../../helpers/sleeper.js";
import { BaseCategoryErrorResponse } from "../../types/index.js";

export type CategoryNode = {
  url: string;
  title: string;
  isRoot?: boolean;
  children?: CategoryNode[];
};

interface FetchSellerCategoryArgs extends FetchCategoryArgs {
  sellerId: string;
}

interface FetchSellerSubcategories
  extends Omit<FetchSellerCategoryArgs, "page"> {
  treeNode?: CategoryNode;
}

export class OzonSellerCategoryProcessor extends OzonCategoryProcessor {
  async fetchCategory({
    categoryId,
    categoryUrl,
    preloadedCookies,
    proxy,
    page = 1,
    sellerId,
  }: FetchSellerCategoryArgs): Promise<
    ProcessCategoryResponse | BaseCategoryErrorResponse
  > {
    const { cookies } = await this.getCookies({ preloadedCookies, proxy });
    // console.log('ccks:', cookies)
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }
    const data = await this.request({
      opts: { proxy },
      cookiesHeaders: { cookies },
      pathLoader: () => ({
        args: [sellerId, categoryId, page.toString()],
        nextUrl: categoryUrl,
      }),
    });
    // console.log(data)
    const parsed = this.process(data);
    if ("err" in parsed) {
      return {
        err: parsed.err,
      };
    }
    return {
      ...parsed,
      cookies,
    };
  }
  async fetchSubcategories({
    categoryId,
    preloadedCookies,
    proxy,
    sellerId,
    treeNode,
    categoryUrl,
  }: FetchSellerSubcategories) {
    const { cookies } = await this.getCookies({ preloadedCookies, proxy });
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }

    const data = await this.request({
      opts: { proxy },
      cookiesHeaders: { cookies },
      pathLoader: () => ({
        args: [sellerId, categoryId],
        nextUrl: categoryUrl,
      }),
    });
    if (!treeNode) {
      treeNode = {
        url: "",
        title: "",
        children: [],
        isRoot: true,
      };
    }
    const parsed = this.processSubcategories(data, treeNode.isRoot);
    if (parsed.root) {
      treeNode.title = parsed.root.title;
      treeNode.url = parsed.root.url;
    }
    for (const node of parsed.children ?? []) {
      treeNode.children?.push(node);
      await sleeper(4000);
      await this.fetchSubcategories({
        categoryUrl: node.url,
        preloadedCookies: { cookies },
        proxy,
        treeNode: node,
        sellerId,
        categoryId: "",
      });
    }
    return treeNode;
  }

  public getPath({ args, nextUrl }: { args: string[]; nextUrl?: string }) {
    if (nextUrl) {
      return encodeURIComponent(nextUrl);
    }
    const pagePart = args[2]
      ? +args[2] > 1
        ? `?layout_container=categorySearchMegapagination&layout_page_index=${args[1]}&page=${args[1]}`
        : ""
      : "";
    const categoryPart = args[1] ? `${args[1]}/` : "";
    return encodeURIComponent(
      `/seller/${args[0]}/${categoryPart}?miniapp=seller_${args[0]}${pagePart}`
    );
  }

  public processSubcategories(
    data: CategoryResponseData,
    root: boolean = false
  ): { children?: CategoryNode[]; root?: CategoryNode; err?: unknown } {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return { err: errChecker.err };
    }
    const parsed = this.stateParser<CategoryParsedData>(data);
    if (parsed.filtersDesktop) {
      console.log(parsed.filtersDesktop);
      const sections = flatten(parsed.filtersDesktop.sections);
      const filters = flatten(sections.map((s) => s.filters));
      const catSection = filters.find((f) => f.type === "categoryFilter");
      if (catSection) {
        let rootNode: CategoryNode | undefined;
        const children = catSection.categoryFilter?.categories
          ?.filter((c) => c.level > 0)
          .map(({ title, urlValue }) => ({
            title,
            url: urlValue,
            children: [],
          }));
        if (root) {
          const r = catSection.categoryFilter?.categories.find(
            (c) => c.level === 0
          );
          if (r) {
            rootNode = {
              url: r.urlValue,
              title: r.title,
            };
          }
        }
        return {
          children,
          root: rootNode,
        };
      }
      return { children: [] };
    }
    return { children: [] };
  }
}
