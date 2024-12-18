import { CookieHeaders } from "../helpers/curl.js";
import { ProcessBodyParams } from "../helpers/renderer.js";
import {
  BaseCookieResponse,
  CookieLoader,
  Fetcher,
  ProxyType,
  RequestBaseProcessorOpts,
  SimpleCookie,
} from "../types/index.js";

export interface BaseFetcherArgs {
  preloadedCookies?: BaseCookieResponse;
  proxy: ProxyType;
}

interface ParsedCookie {
  name: string;
  value: string;
  Path?: string;
  Secure?: boolean;
  HttpOnly?: boolean;
  SameSite?: "Strict" | "Lax" | "None";
  Expires?: string;
  Domain?: string;
  [key: string]: string | boolean | undefined;
}

export abstract class RequestBase<T = unknown> {
  public fetcher: Fetcher<T>;
  public cookieLoader: CookieLoader;

  constructor({ fetcher, cookieLoader }: RequestBaseProcessorOpts<T>) {
    this.fetcher = fetcher;
    this.cookieLoader = cookieLoader;
  }

  public abstract getCookieLoaderParams(): Omit<
    Partial<ProcessBodyParams>,
    "proxy"
  >;

  public readCookies({
    headers,
    existing,
    merge = true,
  }: {
    headers: CookieHeaders;
    existing?: SimpleCookie[];
    merge?: boolean;
  }) {
    const found = headers.find((chunk) => !!chunk["Set-Cookie"]);
    if (found) {
      const newCookies = found["Set-Cookie"].map((cookie) =>
        this.parseSetCookieHeader(cookie)
      ).filter(c => !!c.value.trim())
      if (existing && merge) {
        const notOverriden = existing.filter(e => !newCookies.find(n => n.name === e.name));
        return [
          ...newCookies,
          ...notOverriden
        ]
      }
    }
  }

  private parseSetCookieHeader(cookieStr: string): ParsedCookie {
    const parts = cookieStr.split(";").map((part) => part.trim());
    const [nameValuePair, ...attributes] = parts;

    // Parse the name and value
    const [name, ...valueParts] = nameValuePair.split("=");
    const value = valueParts.join("=");

    // Build the cookie object
    const cookie: ParsedCookie = { name, value: decodeURIComponent(value) };

    // Parse attributes like Path, Secure, HttpOnly, etc.
    for (const attribute of attributes) {
      const [attrName, attrValue] = attribute.split("=");
      const key = attrName.trim() as keyof ParsedCookie;

      if (key === "Secure" || key === "HttpOnly") {
        cookie[key] = true; // Boolean attributes
      } else if (key === "SameSite") {
        cookie[key] = attrValue?.trim() as "Strict" | "Lax" | "None";
      } else if (attrValue) {
        cookie[key] = decodeURIComponent(attrValue.trim());
      }
    }

    return cookie;
  }

  public async getCookies({
    proxy,
    preloadedCookies,
  }: BaseFetcherArgs): Promise<BaseCookieResponse> {
    if (preloadedCookies) {
      return preloadedCookies;
    }
    const params: Partial<ProcessBodyParams> = this.getCookieLoaderParams();
    params.proxy = proxy;
    const data = this.cookieLoader(params);
    return data;
  }
}
