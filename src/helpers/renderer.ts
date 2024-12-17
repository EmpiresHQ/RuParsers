import * as dotenv from "dotenv";
import { ProxyType } from "../types/index.js";
dotenv.config();

export interface Cookie {
  name: string;
  value: string;
}

export interface RenderResult {
  cookies?: Cookie[];
  evaluatedValue?: unknown;
  screenshot?: string;
  body?: string;
  documentBody?: string;
}

export type ProcessBodyParams = {
  url?: string | string[];
  fetchCookies?: {
    domains: string[];
    cookieNames?: string[];
  };
  getBody?: boolean;
  getDocumentBody?: boolean;
  cookies?: Cookie[];
  waitBeforeLoad?: number;
  waitAfterLoad?: number;
  waitForElement?: string;
  evaluateRuntime?: string;
  takeScreenshot?: boolean;
  onlyFailed?: boolean;
  waitUrl?: string;
  waitUrlFallback?: boolean;
  setPageContent?: string;
  waitNetworkCookie?: {
    domain: string;
    name: string;
  };
  proxy?: {
    url: string;
  };
  os?: string;
  settings?: {
    loadMedia?: boolean;
    requestTimeout?: number;
    screenShot?: {
      format?: "jpeg" | "png" | "webp";
      quality?: number;
      fromSurface?: boolean;
      captureBeyondViewport?: boolean;
    };
    browser?: {
      window: {
        width: number;
        height: number;
      };
      userAgent?: string;
      userAgentMetadata?: {
        platform?: string;
        // platformVersion?: string;
        model?: string;
        mobile?: boolean;
        fullVersion?: string;
        brands?: Array<{ brand: string; version: string }>;
        architecture?: string;
        platformVersion?: string;
      };
    };
  };
};

export const proxyUrlFromType = ({url, auth}: ProxyType): string => {
  const urlObj = new URL(url)
  if (auth) {
    const [username, password] = auth.split(":");
    urlObj.username = username;
    urlObj.password = password;
  }
  return urlObj.toString()
  
}

export const renderer = async (params: ProcessBodyParams): Promise<RenderResult> => {
  if (!process.env.PARSERS_URL) {
    throw new Error("no parsers url");
  }
  const data = await fetch(`${process.env.PARSERS_URL}/process`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(params)
  })
  const res = await data.json()
  console.log('res: ', res)
  return res as RenderResult
};
