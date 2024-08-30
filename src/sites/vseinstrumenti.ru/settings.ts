import {
  BaseRequestParameters,
  InitialSettings,
  RequestOpts,
  RequestParameters,
  RequiredCookies,
  RequiredHeaders,
  SimpleCookie,
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
  remoteCategoryId: handler.data.remoteId ?? 1,
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
    waitAfterLoad: 5000,
  },
  perPage: 40,
};

export const API_SETTINGS: InitialSettings = {
  antibotOpts: {
    url: API_HOST,
    fetchCookies: {
      domains: ["https://vseinstrumenti.ru"],
      cookieNames: ["acctoken", "cf_clearance"],
    },
    waitUrl: "challenge-platform",
    waitAfterLoad: 5000,
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
  remoteCategoryId: number
}
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
}

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
  handler: RequestOpts<{ cookies: SimpleCookie[] }>,
  page: number = 0
): RequestParameters<ApiPayload> => ({
  urlPath: `/api/category/load?short=true`,
  host: API_HOST,
  method: "POST",
  headers: [
    "Content-Type: application/json",
    ...(handler.data.meta?.cookies
      ? [
          `Token: ${handler.data.meta?.cookies.find((c) => c.name == `acctoken`)?.value}`,
        ]
      : []),
  ],
  remoteCategoryId: handler.data.remoteId ?? 1,
  page,
  payload: {
    listingType: "category",
    id: _idFromUrl(handler.data.text),
    page: {
      number: page,
      perPage: API_SETTINGS.perPage,
    },
  },
});

const _idFromUrl = (text: string): number => +(text.split("-").pop() ?? -1);

export const requiredCookies: RequiredCookies = ["acctoken", "cf_clearance"];

export const requiredHeaders: RequiredHeaders = ["Token"];
