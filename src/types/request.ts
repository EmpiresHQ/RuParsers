import { BaseFetcherArgs } from "../base/request.js";
import { CurlResponse } from "../helpers/curl.js";
import { ProcessBodyParams } from "../helpers/renderer.js";
import {
  BaseItem,
  BaseRequestParameters,
  SimpleCookie,
} from "./index.js";

export interface BaseItemArgs extends BaseFetcherArgs {
  itemId: string;
}
export interface BaseCategoryArgs extends BaseFetcherArgs {
  categoryId: string | number;
  categoryUrl?: string;
  page?: number;
}

export interface RequestBaseProcessorOpts<T> {
  fetcher: Fetcher<T>;
  cookieLoader: CookieLoader;
}

export type BaseCategoryErrorResponse = {
  err: unknown;
  cookies?: SimpleCookie[];
};

export interface BaseCategoryResponse<T extends Record<string, unknown> = Record<string, unknown>> {
  cookiesHeaders?: BaseCookieResponse;
  items: BaseItem<T>[];
  hasNextPage?: boolean;
  nextPage?: string;
}

export interface BaseItemResponse<T extends Record<string, unknown> = Record<string, unknown>> {
  err?: string;
  cookiesHeaders?: BaseCookieResponse;
  item?: BaseItem<T>;
}

export type BaseCookieResponse = {
  cookies?: SimpleCookie[];
  headers?: Record<string, string | undefined>;
};

export type Fetcher<T = unknown> = (
  opts: Omit<BaseRequestParameters, "cookies"> & { cookies: SimpleCookie[] }
) => Promise<CurlResponse<T>>;

export type CookieLoader = (opts: Partial<ProcessBodyParams>) => Promise<BaseCookieResponse>;
