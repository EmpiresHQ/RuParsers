import { BaseCategory, SimpleCookie } from "../../types/index.js";
import {
  BaseRequestParameters,
  InitialSettings,
} from "../../types/settings.js";

export type TreeParser = (args: {
  preloader: (s: InitialSettings) => Promise<{ cookies?: SimpleCookie[] }>;
  loader: (
    args: Omit<BaseRequestParameters, "cookies">,
    cookies: SimpleCookie[]
  ) => Promise<CatResponse>;
}) => Promise<BaseCategory[]>;

export type CatResponse = {message: unknown, data: Category[]}

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
