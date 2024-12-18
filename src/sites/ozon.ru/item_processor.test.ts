import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { proxyUrlFromType } from "../../helpers/renderer.js";
import {
  BaseCategoryResponse,
  BaseCookieResponse,
  PlatformProcesors,
} from "../../types/index.js";
import { cookieLoader, loader, ozonProxy } from "../../base/index.js";
import { AvailablePlatformsv2 } from "../../index.js";
dotenv.config();

let preloadedCookies: BaseCookieResponse;
let parser: PlatformProcesors | undefined;

describe("OZON", () => {
  beforeAll(async () => {
    preloadedCookies = await cookieLoader({
      url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/product/1428983821`)})`,
      waitAfterLoad: 4000,
      getDocumentBody: true,
      fetchCookies: {
        domains: ["https://www.ozon.ru"],
        cookieNames: ["abt_data", "__Secure-ETC"],
      },
      proxy: {
        url: proxyUrlFromType(ozonProxy),
      },
    });
    parser = AvailablePlatformsv2("ozon.ru", {
      fetcher: loader,
      cookieLoader,
    });
  }, 5000000);
  test("ozon:load item", async () => {
    const parsed = await parser?.itemLoader?.fetchItem({
      itemId: "1428983821",
      preloadedCookies,
      proxy: ozonProxy,
    });

    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  // test("ozon:load meta item", async () => {
  //   const itemProcessor = new OzonItemMetaProcessor({
  //     fetcher: loader,
  //     cookieLoader,
  //   });

  //   const parsed = await itemProcessor.fetchItem({
  //     itemId: "1428983821",
  //     preloadedCookies,
  //     proxy,
  //   });
  //   console.log(parsed);
  //   expect(parsed).toBeDefined();
  // });

  test.only("ozon:load category", async () => {
    const parsed: BaseCategoryResponse[] = [];
    for (const page of [1, 2]) {
      const data = await parser?.categoryLoader?.fetchCategory({
        categoryId: "smartfony-15502",
        page,
        preloadedCookies,
        proxy: ozonProxy,
      });
      if (!data || "err" in data) {
        throw new Error("parse failed");
      }
      preloadedCookies.cookies = data.cookiesHeaders?.cookies;
      parsed.push(data);
    }

    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  // test("ozon:seller category", async () => {
  //   const itemProcessor = new OzonSellerCategoryProcessor({
  //     fetcher: loader as Fetcher<CategoryResponseData>,
  //     cookieLoader,
  //   });

  //   const parsed = await itemProcessor.fetchCategory({
  //     sellerId: "1456889",
  //     categoryId: "",
  //     page: 1,
  //     preloadedCookies,
  //     proxy,
  //   });
  //   console.log(parsed);
  //   expect(parsed).toBeDefined();
  // });

  // test.only("ozon:seller category subtree", async () => {
  //   const itemProcessor = new OzonSellerCategoryProcessor({
  //     fetcher: loader as Fetcher<CategoryResponseData>,
  //     cookieLoader,
  //   });

  //   const parsed = await itemProcessor.fetchSubcategories({
  //     sellerId: "1456889",
  //     categoryId: "",
  //     preloadedCookies,
  //     proxy,
  //   });
  //   console.log(parsed);
  //   expect(parsed).toBeDefined();
  // });
}, 5000000);
