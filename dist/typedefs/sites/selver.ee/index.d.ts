import { StrategyHandler } from "../../types/index.js";
import { ProductContainer } from "./types.js";
export * from "./category_parser.js";
export * from "./settings.js";
export declare const strategies: {
    [key in string]: StrategyHandler<any, ProductContainer[] | {
        error: unknown;
    }>;
};
export declare const preferredStrategy = "js";
export declare const categoryParser: import("./types.js").TreeParser;
//# sourceMappingURL=index.d.ts.map