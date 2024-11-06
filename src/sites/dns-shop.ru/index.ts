// import { apiParser } from "./category_parser.js";
import { StrategyHandler } from "../../types/index.js";
import { apiParser } from "./category_parser.js";
import { treeLoader } from "./category_tree.js";
import { fetcher } from "./fetcher.js";
import { API_SETTINGS, apiRequestOpts } from "./settings.js";
import { DNSItem } from "./types.js";

// export * from "./category_parser.js";
export * from "./types.js";

export const strategies: {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  [key in string]: StrategyHandler<any, DNSItem[] | {error: unknown}>;
} = {
  api: {
    fetcher,
    parser: apiParser,
    opts: apiRequestOpts,
    settings: API_SETTINGS,
  },
};
export const preferredStrategy = "api";
export const categoryParser = treeLoader;
