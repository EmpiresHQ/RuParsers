import { apiParser } from "./category_parser.js";
import { apiRequestOpts } from "./settings.js";
import { fetcher } from "./fetcher.js";
import { treeParser } from "./category_tree.js";
export * from "./category_parser.js";
export * from "./settings.js";
// export * from "./types.js";
// import { jsParser } from "./category_parser.js";
// import { treeParser } from "./category_tree.js";
// import { REST_SETTINGS, restRequestOpts } from "./settings.js";
export const strategies = {
    js: {
        parser: apiParser,
        opts: apiRequestOpts,
        settings: {
            perPage: 10,
        },
        fetcher,
    },
};
export const preferredStrategy = "js";
export const categoryParser = treeParser;
