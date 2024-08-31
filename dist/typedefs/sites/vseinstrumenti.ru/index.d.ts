import { StrategyHandler } from "../../types/index.js";
export * from "./category_parser.js";
export * from "./settings.js";
export * from "./types.js";
export declare const strategies: {
    [key in string]: StrategyHandler;
};
export declare const preferredStrategy = "api";
export declare const categoryParser: import("./types.js").TreeParser;
//# sourceMappingURL=index.d.ts.map