import { apiParser } from "./category_parser.js";
import { treeLoader } from "./category_tree.js";
import { fetcher } from "./fetcher.js";
import { API_SETTINGS, apiRequestOpts } from "./settings.js";
// export * from "./category_parser.js";
export * from "./types.js";
export const strategies = {
    api: {
        fetcher,
        parser: apiParser,
        opts: apiRequestOpts,
        settings: API_SETTINGS,
    },
};
export const preferredStrategy = "api";
export const categoryParser = treeLoader;
