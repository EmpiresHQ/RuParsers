import { AvailablePlatforms, StrategyHandler } from "./types/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export declare const availablePlatforms: {
    [key in AvailablePlatforms]: {
        strategies: {
            [strategy in string]: StrategyHandler;
        };
        preferredStrategy: "api" | "js";
    };
};
//# sourceMappingURL=index.d.ts.map