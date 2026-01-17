import { describe, expect, test } from "vitest";
import { BaseCategoryResponse, BaseCookieResponse } from "../../types/index.js";
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";

let preloadedCookies: BaseCookieResponse | undefined = undefined;

describe("DNS", () => {
  test("dns:load category", async () => {
    const parser = AvailablePlatformsv2("dns-shop.ru", {
      fetcher: loader,
      cookieLoader,
    })
    if (!parser || parser.name !== "dns-shop.ru") {
      throw new Error('VI parser not found')
    }

    const data: BaseCategoryResponse[] = []
    for (const page of [1, 2]) {
      const parsed = await parser.categoryLoader.fetchCategory({
        categoryId: "234c1343852e5710",
        categoryUrl: "/catalog/recipe/234c1343852e5710/akkumulatornye-batarei/",
        proxy,
        page,
        preloadedCookies,
      });
      if (!parsed || 'err' in parsed) {
        throw new Error('not parsed')
      }
      if (parsed.cookiesHeaders) {
        preloadedCookies = parsed.cookiesHeaders
      }
      data.push(parsed)
    }
    
    console.log(data);
    expect(data[0].items).toBeDefined();
    
  }, 5000000);
});
