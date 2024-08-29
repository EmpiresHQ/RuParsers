import * as vi from "./sites/vseinstrumenti.ru/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export const availablePlatforms = {
    "vseinstrumenti.ru": {
        strategies: vi.strategies,
        preferredStrategy: vi.preferredStrategy,
    },
};
