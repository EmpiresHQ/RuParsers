import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { OzonItemProcessor } from "./item_processor.js";
import { BaseResponseData, CategoryResponseData } from "./types.js";
import { ProxyType } from "../../types/settings.js";
import { OzonItemMetaProcessor } from "./item_meta_processor.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { OzonCategoryProcessor } from "./category_processor.js";
import { BaseCookieResponse, Fetcher } from "../../types/index.js";
import { OzonSellerCategoryProcessor } from "./seller_category_processor.js";

dotenv.config();

const proxy: ProxyType = {
  url: process.env.TEST_OZON_PROXY_URL ?? "",
  auth: process.env.TEST_OZON_PROXY_AUTH ?? "",
};

const cookieLoader = async () => {
  const proxyUrl = proxyUrlFromType(proxy);
  const res = await renderer({
    url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/product/1428983821`)})`,
    waitAfterLoad: 4000,
    getDocumentBody: true,
    fetchCookies: {
      domains: ["https://www.ozon.ru"],
      cookieNames: ["abt_data", "__Secure-ETC"],
    },
    proxy: {
      url: proxyUrl,
    },
  });
  return {
    cookies: (res.cookies ?? []).map(({ name, value }) => ({ name, value })),
  };
};

const loader: Fetcher<BaseResponseData | CategoryResponseData> = async (
  opts
) => {
  opts.headers = [
    "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    `Sec-Fetch-Dest: document`,
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: cross-site",
    `Sec-ch-ua-platform: "Linux"`,
  ];
  const data = await curlFetch({ ...opts, version: "V2Tls" }, "json");
  return data as BaseResponseData | CategoryResponseData;
};

let preloadedCookies: BaseCookieResponse;

describe("OZON", () => {
  beforeAll(async () => {
    preloadedCookies = await cookieLoader();
  }, 5000000);
  test("ozon:load item", async () => {
    const itemProcessor = new OzonItemProcessor({
      fetcher: loader,
      cookieLoader,
    });

    const parsed = await itemProcessor.fetchItem({
      itemId: "1428983821",
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  test("ozon:load meta item", async () => {
    const itemProcessor = new OzonItemMetaProcessor({
      fetcher: loader,
      cookieLoader,
    });

    const parsed = await itemProcessor.fetchItem({
      itemId: "1428983821",
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  test("ozon:load category", async () => {
    const itemProcessor = new OzonCategoryProcessor({
      fetcher: loader as Fetcher<CategoryResponseData>,
      cookieLoader,
    });

    const parsed = await Promise.all(
      [1, 2].map((i) =>
        itemProcessor.fetchCategory({
          categoryId: "smartfony-15502",
          page: i,
          preloadedCookies,
          proxy,
        })
      )
    );
    console.log(parsed);
    expect(parsed).toBeDefined();
  });
  test("ozon:seller category", async () => {
    const itemProcessor = new OzonSellerCategoryProcessor({
      fetcher: loader as Fetcher<CategoryResponseData>,
      cookieLoader,
    });

    const parsed = await itemProcessor.fetchCategory({
      sellerId: "1456889",
      categoryId: "",
      page: 1,
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  test.only("ozon:seller category subtree", async () => {
    const itemProcessor = new OzonSellerCategoryProcessor({
      fetcher: loader as Fetcher<CategoryResponseData>,
      cookieLoader,
    });

    const parsed = await itemProcessor.fetchSubcategories({
      sellerId: "1456889",
      categoryId: "",
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });
}, 5000000);
