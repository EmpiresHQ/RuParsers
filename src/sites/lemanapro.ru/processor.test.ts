import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { BaseCookieResponse, Fetcher, ProxyType } from "../../types/index.js";
import { Page } from "./types.js";
import { API_SETTINGS } from "./settings.js";
import { CategoryProcessor } from "./category_v2.js";

dotenv.config();

const proxy: ProxyType = {
  url: process.env.TEST_PROXY_URL ?? "",
  auth: process.env.TEST_PROXY_AUTH ?? "",
};

const cookieLoader = async () => {
  const proxyUrl = proxyUrlFromType(proxy);
  const res = await renderer({
    ...API_SETTINGS.antibotOpts,
    proxy: {
      url: proxyUrl,
    },
  });
  const cookies = (res.cookies ?? []).map(({ name, value }) => ({ name, value }));
  // const token = cookies && cookies.find( ({name}) => name == '_ym_uid')
  return {
    cookies,
    headers: {token: "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv"}
  };
};

const loader: Fetcher<Page> = async (opts) => {
  opts.headers = [
    "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    `Sec-Fetch-Dest: document`,
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: cross-site",
    `Sec-ch-ua-platform: "Linux"`,
    ...opts.headers ?? [],
  ];
  const data = await curlFetch({ ...opts, version: "V2Tls" }, "json");
  return data as Page;
};

let preloadedCookies: BaseCookieResponse;

describe("Lemana", () => {
  beforeAll(async () => {
    preloadedCookies = await cookieLoader();
  }, 5000000);
  test("lemana:load category", async () => {
    const categoryProcessor = new CategoryProcessor({
      fetcher: loader,
      cookieLoader,
    });

    const parsed = await categoryProcessor.fetchCategory({
      categoryId: "a58305a0-03a1-11ef-9a30-ddd1cb673d49",
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    if ('err' in parsed) {
      throw new Error(JSON.stringify(parsed.err))
    }
    expect(parsed.items[0].skuId).toBeDefined()
    expect(parsed).toBeDefined();
  }, 5000000);
});
