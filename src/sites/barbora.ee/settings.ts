import { InitialSettings, RequestOpts, RequestParameters } from "../../types/index.js";

export const HOST = "https://barbora.ee"

export const restRequestOpts = (
    handler: RequestOpts,
    page: number = 0
  ): RequestParameters => ({
    urlPath:
      page > 1
        ? `/${handler.data.text}?page=${page}`
        : `/${handler.data.text}/`,
    method: "GET",
    host: HOST,
    remoteCategoryId: handler.data.remoteId ?? "1",
    page,
  });

  export const REST_SETTINGS: InitialSettings = {   
    perPage: 100,
  };