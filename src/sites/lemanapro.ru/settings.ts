import {
  AntiBotKey,
  InitialSettings,
  RequestOpts,
  RequestParameters,
} from "../../types/index.js";
import { ApiPayload, PLPModel } from "./index.js";

const API_HOST = "https://api.lemanapro.ru";
export const HOST = "https://lemanapro.ru"

export const API_SETTINGS: InitialSettings = {
  antibotOpts: {
    url: HOST,
    waitAfterLoad: 4000,
    // evaluateRuntime: "window.INITIAL_STATE['plp']['plp']",
    // waitForElement: "#init",
    fetchCookies: {
      domains: ["https://lemanapro.ru"],
      cookieNames: ["qrator_jsid2", "_ym_uid", "qrator_jsr", "_regionID"],
    },
  },
  perPage: 40,
};

export const treeRootSettings: InitialSettings = {
  antibotOpts:{
    url: `${HOST}/catalogue`,
    waitAfterLoad: 4000,
    evaluateRuntime: "window.INITIAL_STATE",
    fetchCookies: {
      domains: ["https://lemanapro.ru"],
      cookieNames: ["qrator_jsid2", "_ym_uid", "qrator_jsr", "_regionID"],
    },
  },
  perPage: -1
}


export const apiRequestOpts = (
  handler: RequestOpts<AntiBotKey & {key: string}>,
  page: number = 0
): RequestParameters<ApiPayload> => {
  const token = handler.data.meta?.antibotData?.evaluatedValue ? 
  (handler.data.meta?.antibotData?.evaluatedValue as PLPModel).env.apiKey : "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv";
  return {
    urlPath: `/hybrid/v1/getProducts?lang=ru`,
    host: API_HOST,
    method: "POST",
    headers: [
      "Content-Type: application/json",
      `x-api-key: ${token}`
    ],
    remoteCategoryId: handler.data.remoteId ?? "",
    page,
    payload: {
      familyIds: [handler.data.remoteId ?? ""],
      regionId: "34",
      suggest: true,
      limit: 30,
      offset: page * 30
    },
  };
};
