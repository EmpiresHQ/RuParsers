import {
  AntiBotKey,
  // AntiBotKey,
  InitialSettings,
  RequestOpts,
  // RequestOpts,
  RequestParameters,
} from "../../types/index.js";
import { PricePayload } from "./index.js";

export const API_HOST = "https://restapi.dns-shop.ru/v1";
export const WEB_HOST = "https://www.dns-shop.ru";

export const API_SETTINGS: InitialSettings = {
  antibotOpts: {
    url: `${WEB_HOST}`,
    waitAfterLoad: 4000,
    fetchCookies: {
      domains: ["https://dns-shop.ru"],
      cookieNames: ["qrator_jsid", "qrator_jsr", "qrator_ssid"],
    },
  },
  perPage: 17,
};

export const categoryRequestOpts = (): RequestParameters<unknown> => {
  return {
    urlPath: `/get-menu?maxMenuLevel=3`,
    host: API_HOST,
    method: "GET",
    headers: ["Content-Type: application/json"],
    remoteCategoryId: "",
  };
};

export const apiRequestOpts = (
  handler: RequestOpts<AntiBotKey>,
  page: number = 0
): RequestParameters => {
  return {
    urlPath: `/catalog/${handler.data.remoteId ?? ""}/?p=${page}`,
    host: WEB_HOST,
    method: "GET",
    headers: [
      "Content-Type: application/json",
      `cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5`,
      `x-requested-with: XMLHttpRequest`,
    ],
    remoteCategoryId: handler.data.remoteId ?? "",
    page,
  };
};

export const priceRequestOpts = (
  pl: PricePayload[]
): RequestParameters<string> => {
  const data = { type: "product-buy", containers: pl };
  return {
    urlPath: `/ajax-state/product-buy/`,
    host: WEB_HOST,
    method: "POST",
    headers: [
      "Content-Type: application/x-www-form-urlencoded",
      "accept: */*",
      `x-requested-with: XMLHttpRequest`,
    ],
    remoteCategoryId: "",
    raw: `data=${JSON.stringify(data)}`,
    page: -1,
  };
};

export const imageRequestOpts = (
  imageIds: string[]
): RequestParameters<string> => {
  return {
    urlPath: `/catalog/product/get-images/`,
    host: WEB_HOST,
    method: "POST",
    headers: [
      "Content-Type: application/x-www-form-urlencoded",
      "accept: */*",
      `x-requested-with: XMLHttpRequest`,
    ],
    remoteCategoryId: "",
    raw: `ids=${JSON.stringify(imageIds)}`,
    page: -1,
  };
};
