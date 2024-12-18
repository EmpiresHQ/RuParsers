import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";
import { BaseCategoryResponse, BaseCookieResponse } from "../../types/request.js";

dotenv.config();

let preloadedCookies: BaseCookieResponse | undefined = undefined;

describe("Lemana", () => {
  // beforeAll(async () => {
  //   preloadedCookies = await cookieLoader();
  // }, 5000000);
  test("lemana:load category", async () => {
    const parser = AvailablePlatformsv2("lemanapro.ru", {
      fetcher: loader,
      cookieLoader,
    });
    if (!parser) {
      throw new Error("VI parser not found");
    }
    const categoryProcessor = parser.categoryLoader;
    const data: BaseCategoryResponse[] = []
    for (const page of [1, 2]) {
      const parsed = await categoryProcessor.fetchCategory({
        categoryId: "a58305a0-03a1-11ef-9a30-ddd1cb673d49",
        page,
        preloadedCookies,
        proxy,
      });
      if (!parsed || 'err' in parsed) {
        throw new Error('lemana parse failed')
      }
      if (parsed.cookiesHeaders) {
        preloadedCookies = parsed.cookiesHeaders
      }
      data.push(parsed)
    }
    expect(data.length).toBe(2)
    expect(data[0].items[0].skuId).toBeDefined();
    expect(data).toBeDefined();
  }, 5000000);
});
