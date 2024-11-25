import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { OzonItemProcessor } from "./item_processor.js";
import { ItemResponseData } from "./types.js";
import { ProxyType } from "../../types/settings.js";
import { OzonItemMetaProcessor } from "./item_meta_processor.js";
import { Fetcher } from "./base.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
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
    proxy:{
      url: proxyUrl,
    }
  });
  return (res.cookies ?? []).map(({name, value}) => ({name, value}));
};

const loader: Fetcher = async (opts) => {
  opts.headers = [
    "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    `Sec-Fetch-Dest: document`,
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: cross-site",
    `Sec-ch-ua-platform: "Linux"`,
  ];
  const data = await curlFetch({ ...opts, version: "V2Tls" }, "json");
  return data as ItemResponseData;
};

describe("OZON", () => {
  test.only("ozon:load item", async () => {
    const itemProcessor = new OzonItemProcessor({
      fetcher: loader,
      cookieLoader,
    });

    const parsed = await itemProcessor.fetchItem({
      itemId: "1428983821",
      // preloadedCookies: [],
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
      // preloadedCookies: [],
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });
}, 5000000);
