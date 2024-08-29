import { StrategyHandler } from "../../types/index.js";
import { apiParser, htmlParser, jsParser } from "./category_parser.js";
import { apiRequestOpts, REST_SETTINGS, restRequestOpts } from "./settings.js";

export * from "./category_parser.js";
export * from "./settings.js";

export const strategies: {
  [key in string]: StrategyHandler;
} = {
  html: {
    parser: htmlParser,
    opts: restRequestOpts,
    settings: REST_SETTINGS,
  },
  js: {
    parser: jsParser,
    opts: restRequestOpts,
    settings: REST_SETTINGS,
  },
  api: {
    parser: apiParser,
    opts: apiRequestOpts,
    settings: REST_SETTINGS,
  }
};

export const preferredStrategy = "api";
