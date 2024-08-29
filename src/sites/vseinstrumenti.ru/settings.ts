import {
  InitialSettings,
  RequestOpts,
  RequestParameters,
  RequiredCookies,
  RequiredHeaders,
} from "../../types/index.js";

export const HOST = "https://www.vseinstrumenti.ru";
export const API_HOST = "https://bff.vseinstrumenti.ru";

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
  }
}

export type ApiPayload = {
  listingType: string;
  id: number;
  page: {
    number: number;
    perPage: number;
  };
};

export const apiRequestOpts = (
  handler: RequestOpts,
  page: number = 0
): RequestParameters<ApiPayload> => ({
  urlPath: `/api/category/load?short=true`,
  host: API_HOST,
  method: "GET",
  remoteCategoryId: handler.data.remoteId ?? 1,
  page,
  payload: {
    listingType: 'category',
    id: handler.data.remoteId,
    page: {
      number: page,
      perPage: 40
    }
  }
});

export const requiredCookies: RequiredCookies = ["acctoken", "cf_clearance"];

export const requiredHeaders: RequiredHeaders = ["Token"];
