import { apiParser, htmlParser, jsParser } from "./category_parser.js";
import { treeParser } from "./category_tree.js";
import { apiRequestOpts, REST_SETTINGS, API_SETTINGS, restRequestOpts } from "./settings.js";
export * from "./category_parser.js";
export * from "./settings.js";
export * from "./types.js";
export const strategies = {
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
        settings: API_SETTINGS,
    }
};
export const preferredStrategy = "api";
export const categoryParser = treeParser;
