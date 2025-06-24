import * as dotenv from "dotenv";
import { curlFetch } from "../helpers/curl.js";
import { ProcessBodyParams, proxyUrlFromType, renderer } from "../helpers/renderer.js";
import { Fetcher, ProxyType } from "../types/index.js";

dotenv.config();

export const proxy: ProxyType = {
  url: process.env.TEST_PROXY_URL ?? "",
  auth: process.env.TEST_PROXY_AUTH ?? "",
};

export const ozonProxy: ProxyType = {
  url: process.env.TEST_OZON_PROXY_URL ?? "",
  auth: process.env.TEST_OZON_PROXY_AUTH ?? "",
};

export const cookieLoader = async (opts: Partial<ProcessBodyParams> = {}) => {
  const proxyUrl = proxyUrlFromType(proxy);
  const res = await renderer({
    ...opts,
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

export const loader: Fetcher = async (opts) => {
  return curlFetch(opts, "json");
};