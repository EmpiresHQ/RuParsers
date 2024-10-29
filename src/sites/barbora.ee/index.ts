import { StrategyHandler } from "../../types/index.js";

export * from "./category_parser.js";
export * from "./settings.js";
export * from "./types.js";

import { jsParser } from "./category_parser.js";
import { treeParser } from "./category_tree.js";
import { REST_SETTINGS, restRequestOpts } from "./settings.js";

export const strategies: {
  [key in string]: StrategyHandler;
} = {
  
  js: {
    parser: jsParser,
    opts: restRequestOpts,
    settings: REST_SETTINGS,
  },
  
};

export const preferredStrategy = "js";
export const categoryParser = treeParser
