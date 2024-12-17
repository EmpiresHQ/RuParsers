import { BaseClass } from "./base/index.js";
import { AvailablePlatforms, CookieLoader, Fetcher, StrategyHandler } from "./types/index.js";
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
export declare const AvailablePlatformsv2: (platform: AvailablePlatforms, { fetcher, cookieLoader, }: {
    fetcher: Fetcher<unknown>;
    cookieLoader: CookieLoader;
}) => {
    categoryLoader: BaseClass;
} | undefined;
//# sourceMappingURL=index.d.ts.map