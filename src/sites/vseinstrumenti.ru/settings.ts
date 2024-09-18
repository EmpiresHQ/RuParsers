import {
  AntiBotKey,
  BaseRequestParameters,
  InitialSettings,
  RequestOpts,
  RequestParameters,
  RequiredCookies,
  RequiredHeaders,
  // SimpleCookie,
} from "../../types/index.js";
import { ApiPayload } from "./index.js";

export const HOST = "https://www.vseinstrumenti.ru";
export const API_HOST = "https://bff.vseinstrumenti.ru";
export const CDN_HOST = "https://cdn.vseinstrumenti.ru";

export const restRequestOpts = (
  handler: RequestOpts,
  page: number = 0
): RequestParameters => ({
  urlPath:
    page > 1
      ? `/category/${handler.data.text}/page${page}/`
      : `/category/${handler.data.text}/`,
  method: "GET",
  host: HOST,
  remoteCategoryId: handler.data.remoteId ?? "1",
  page,
});

export const REST_SETTINGS: InitialSettings = {
  antibotOpts: {
    url: HOST,
    fetchCookies: {
      domains: ["https://vseinstrumenti.ru"],
      cookieNames: ["acctoken", "cf_clearance"],
    },
    waitUrl: "challenge-platform",
    waitUrlFallback: true,
    waitAfterLoad: 5000,
  },
  perPage: 40,
};

export const API_SETTINGS: InitialSettings = {
  antibotOpts: {
    url: HOST,
    fetchCookies: {
      domains: ["https://vseinstrumenti.ru"],
      cookieNames: ["acctoken", "cf_clearance", "__cf_bm", "_cfuvid", "reftoken"],
    },
    waitUrl: "challenge-platform",
    waitUrlFallback: true,
    waitAfterLoad: 3000,
  },
  perPage: 40,
};

export const treeRootOpts = (): BaseRequestParameters => ({
  urlPath: `/api/catalog/topics`,
  host: API_HOST,
  method: "GET",
  headers: ["Content-Type: application/json"],
});

export type TreeLeafOptsArgs = {
  remoteCategoryId: number;
};
export const treeLeafOpts = ({
  remoteCategoryId,
}: TreeLeafOptsArgs): BaseRequestParameters => ({
  urlPath: `/api/catalog/categories?id=${remoteCategoryId}&activeRegionId=-1`,
  host: API_HOST,
  method: "GET",
  headers: ["Content-Type: application/json"],
});

export type TreeChildArgs = {
  left: number;
  right: number;
};

export const treeChildOpts = ({
  left,
  right,
}: TreeChildArgs): BaseRequestParameters => ({
  urlPath: `/api/catalog/child-categories?leftBorder=${left}&rightBorder=${right}&activeRegionId=-1`,
  host: API_HOST,
  method: "GET",
  headers: ["Content-Type: application/json"],
});

export const apiRequestOpts = (
  handler: RequestOpts<AntiBotKey & {key: string}>,
  page: number = 0
): RequestParameters<ApiPayload> => ({
  urlPath: `/api/category/load?short=true`,
  host: API_HOST,
  method: "POST",
  timeout: 15,
  headers: [
    "Content-Type: application/json",
    ...(handler.data.meta?.antibotData?.cookies
      ? [
          `Token: ${(handler.data.meta?.antibotData.cookies ?? []).find((c) => c.name == `acctoken`)?.value}`,
        ]
      : []),
  ],
  remoteCategoryId: handler.data.remoteId ?? "",
  page,
  payload: {
    listingType: "category",
    id: +handler.data.remoteId,
    page: {
      number: page,
      perPage: API_SETTINGS.perPage,
    },
  },
});

export const requiredCookies: RequiredCookies = ["acctoken", "cf_clearance"];

export const requiredHeaders: RequiredHeaders = ["Token"];
