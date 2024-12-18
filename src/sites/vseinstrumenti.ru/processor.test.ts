import { describe, expect, test } from "vitest";
import { BaseCategoryResponse, BaseCookieResponse } from "../../types/index.js";
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";

let preloadedCookies: BaseCookieResponse | undefined = undefined;

describe("VI", () => {
  test("vi:load category", async () => {
    const parser = AvailablePlatformsv2("vseinstrumenti.ru", {
      fetcher: loader,
      cookieLoader,
    })
    if (!parser) {
      throw new Error('VI parser not found')
    }
    const categoryProcessor = parser.categoryLoader;
    const data: BaseCategoryResponse[] = []
    for (const page of [1, 2]) {
      const parsed = await categoryProcessor.fetchCategory({
        categoryId: 15,
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
