import * as vi from "./sites/vseinstrumenti.ru/index.js";
import * as lp from "./sites/lemanapro.ru/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export const availablePlatforms = {
    "vseinstrumenti.ru": {
        strategies: vi.strategies,
        preferredStrategy: vi.preferredStrategy,
    },
    "lemanapro.ru": {
        strategies: lp.strategies,
        preferredStrategy: lp.preferredStrategy
    }
};
