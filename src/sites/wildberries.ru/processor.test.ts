import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";
import {
  BaseCategoryResponse,
  BaseCookieResponse,
} from "../../types/request.js";

dotenv.config();

let preloadedCookies: BaseCookieResponse | undefined = undefined;

describe("WB", () => {
  // beforeAll(async () => {
  //   preloadedCookies = await cookieLoader();
  // }, 5000000);
  test("WB:load category", async () => {
    const parser = AvailablePlatformsv2("wildberries.ru", {
      fetcher: loader,
      cookieLoader,
    });
    if (!parser) {
      throw new Error("VI parser not found");
    }
    if (parser.name == "wildberries.ru") {
      const categoryProcessor = parser.categoryLoader;
      const data: BaseCategoryResponse[] = [];
      for (const page of [1, 2]) {
        const parsed = await categoryProcessor.fetchCategory({
          categoryId: "130611",
          shard: "gift12",
          page,
          preloadedCookies,
          proxy,
        });
        if (!parsed || "err" in parsed) {
          throw new Error("lemana parse failed");
        }
        if (parsed.cookiesHeaders) {
          preloadedCookies = parsed.cookiesHeaders;
        }
        data.push(parsed);
      }
      expect(data.length).toBe(2);
      expect(data[0].items[0].skuId).toBeDefined();
      expect(data).toBeDefined();
    }
  }, 5000000);
});
