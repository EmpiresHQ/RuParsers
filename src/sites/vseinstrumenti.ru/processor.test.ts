import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { BaseCookieResponse, Fetcher, ProxyType } from "../../types/index.js";
import { Page } from "./types.js";
import { API_SETTINGS } from "./settings.js";
import { AvailablePlatformsv2 } from "../../index.js";

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
  };
};

const loader: Fetcher<Page> = async (opts) => {
  opts.headers = [
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

describe("VI", () => {
  beforeAll(async () => {
    preloadedCookies = await cookieLoader();
  }, 5000000);
  test("vi:load category", async () => {
    const parser = AvailablePlatformsv2("vseinstrumenti.ru", {
      fetcher: loader,
      cookieLoader,
    })
    if (!parser) {
      throw new Error('VI parser not found')
    }
    const categoryProcessor = parser.categoryLoader;

    const parsed = await categoryProcessor.fetchCategory({
      categoryId: 15,
      preloadedCookies,
      proxy,
    });
    console.log(parsed);
    expect(parsed).toBeDefined();
  }, 5000000);
});
