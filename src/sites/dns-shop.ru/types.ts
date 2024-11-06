import { BaseCategory, BaseItem, SimpleCookie } from "../../types/index.js";
import {
  BaseRequestParameters,
  InitialSettings,
} from "../../types/settings.js";

export interface Item extends BaseItem {}

export type TreeParser = (args: {
  preloader: (s: InitialSettings) => Promise<{ cookies?: SimpleCookie[] }>;
  loader: (
    args: Omit<BaseRequestParameters, "cookies">,
    cookies: SimpleCookie[]
  ) => Promise<CatResponse>;
}) => Promise<BaseCategory[]>;

export type CatResponse = { message: unknown; data: Category[] };

export type Category = {
  id: string;
  title: string;
  subtitles: unknown[];
  searchUid: string;
  url: string;
  imageUrl: string;
  imageMenuUrl: string;
  count: number;
  childs: Category[];
  onlyVirtualChildren: boolean;
};

export type CategoryResponse = {
  assets: {
    inlineJs: { [key in string]: string };
  };
};

export type WindowDNS = {
  window: {
    AjaxState?: {
      register: (data: unknown) => void;
    };
  };
};

export type PricePayload = {
  id: string;
  data: {
    id: string;
  };
};

type AjaxPartial = [
  {
    type: string;
    timeout: number;
  },
  {
    id: string;
    data: {
      id: string;
      type: number;
    };
  }[],
  boolean,
];
export type AjaxState = AjaxPartial[];

export type PriceResponse = {
  result: boolean;
  data: {
    states: DNSItem[];
  };
};

export type DNSItem = {
  id: string; //random id
  images?: string[];
  data: {
    id: string;
    name: string;
    price: {
      current: number; // in rubles
    };
    credit: {
      amount: number;
      period: number;
    };
    primaryButton: string; //some html shit
    wishlist: string; // some html shit
    hasHistory: boolean;
    maxPeriodPrice: unknown;
  };
};

export type ImageResponse = {
  data: {
    [key in string]: string[]
  }
}
