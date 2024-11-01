import { StrategyHandler } from "../../types/index.js";
import { apiParser } from "./category_parser.js";
import { apiRequestOpts } from "./settings.js";

export * from "./category_parser.js";
export * from "./settings.js";
// export * from "./types.js";

// import { jsParser } from "./category_parser.js";
// import { treeParser } from "./category_tree.js";
// import { REST_SETTINGS, restRequestOpts } from "./settings.js";

export const strategies: {
  [key in string]: StrategyHandler<object, Map<string, string>>;
} = {
  
  js: {
    parser: apiParser,
    opts: apiRequestOpts,
    settings: {
      perPage: 10,
    },
    ctx: new Map<string, string>()
  },
  
};

export const preferredStrategy = "js";
export const categoryParser = undefined
