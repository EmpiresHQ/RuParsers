import { apiParser } from "./category_parser.js";
import { API_SETTINGS, apiRequestOpts } from "./settings.js";
export * from "./category_parser.js";
export * from "./types.js";
export const strategies = {
    api: {
        parser: apiParser,
        opts: apiRequestOpts,
        settings: API_SETTINGS,
    }
};
export const preferredStrategy = "api";
