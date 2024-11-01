import { RequestOpts, RequestParameters } from "../../types/index.js";

export const API_HOST = "https://www.selver.ee/api/catalog/";

export const MEDIA_HOST = "https://www.selver.ee/img/800/800/resize"

export const apiRequestOpts = async (
  handler: RequestOpts,
  page: number = 0
): Promise<RequestParameters> => ({
  urlPath: "",
  method: "GET",
  host: API_HOST,
  remoteCategoryId: handler.data.remoteId ?? "1",
  page,
});