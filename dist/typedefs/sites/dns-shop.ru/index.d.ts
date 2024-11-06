import { StrategyHandler } from "../../types/index.js";
import { DNSItem } from "./types.js";
export * from "./types.js";
export declare const strategies: {
    [key in string]: StrategyHandler<any, DNSItem[] | {
        error: unknown;
    }>;
};
export declare const preferredStrategy = "api";
export declare const categoryParser: import("./types.js").TreeParser;
//# sourceMappingURL=index.d.ts.map