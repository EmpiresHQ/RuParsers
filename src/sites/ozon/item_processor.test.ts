import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { Fetcher, OzonItemProcessor } from "./item_processor.js";
import { ItemResponseData } from "./types.js";
import { SimpleCookie } from "../../types/base.js";
import { ProxyType } from "../../types/settings.js";
import { OzonItemMetaProcessor } from "./item_meta_processor.js";
dotenv.config();
const cookies: SimpleCookie[] = [
  {
    name: "abt_data",
    value:
      "xxx",
  },
  {
    name: "__Secure-ETC",
    value: "xxx",
  },
];

const proxy: ProxyType = {
  url: "xxx",
  auth: "xxx",
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
  test("ozon:load item", async () => {
    const itemProcessor = new OzonItemProcessor({
      fetcher: loader,
      cookieLoader: () => cookies,
    });

    const parsed = await itemProcessor.fetchItem({
      itemId: "1428983821",
      // preloadedCookies: [],
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  });

  test.only("ozon:load meta item", async () => {
    const itemProcessor = new OzonItemMetaProcessor({
      fetcher: loader,
      cookieLoader: () => cookies,
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
