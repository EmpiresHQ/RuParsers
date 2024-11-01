import { selver_ee, barbora_ee, lemanapro_ru, vseinstrumenti_ru } from "./sites/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export const availablePlatforms = {
    "vseinstrumenti.ru": {
        strategies: vseinstrumenti_ru.strategies,
        preferredStrategy: vseinstrumenti_ru.preferredStrategy,
    },
    "lemanapro.ru": {
        strategies: lemanapro_ru.strategies,
        preferredStrategy: lemanapro_ru.preferredStrategy
    },
    "barbora.ee": {
        strategies: barbora_ee.strategies,
        preferredStrategy: barbora_ee.preferredStrategy
    },
    "selver.ee": {
        strategies: selver_ee.strategies,
        preferredStrategy: selver_ee.preferredStrategy
    }
};
