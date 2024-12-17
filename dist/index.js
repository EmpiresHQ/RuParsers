import { selver_ee, barbora_ee, lemanapro_ru, vseinstrumenti_ru, dns_shop_ru, ozon_ru, } from "./sites/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export const availablePlatforms = {
    "vseinstrumenti.ru": {
        strategies: vseinstrumenti_ru.strategies,
        preferredStrategy: vseinstrumenti_ru.preferredStrategy,
    },
    "lemanapro.ru": {
        strategies: lemanapro_ru.strategies,
        preferredStrategy: lemanapro_ru.preferredStrategy,
    },
    "barbora.ee": {
        strategies: barbora_ee.strategies,
        preferredStrategy: barbora_ee.preferredStrategy,
    },
    "selver.ee": {
        strategies: selver_ee.strategies,
        preferredStrategy: selver_ee.preferredStrategy,
    },
    "dns-shop.ru": {
        strategies: dns_shop_ru.strategies,
        preferredStrategy: dns_shop_ru.preferredStrategy,
    },
};
export const AvailablePlatformsv2 = (platform, { fetcher, cookieLoader, }) => {
    const platforms = {
        ["ozon.ru"]: {
            categoryLoader: new ozon_ru.OzonCategoryProcessor({
                fetcher: fetcher,
                cookieLoader,
            }),
        },
        ["lemanapro.ru"]: {
            categoryLoader: new lemanapro_ru.CategoryProcessor({
                fetcher: fetcher,
                cookieLoader,
            }),
        },
        ["vseinstrumenti.ru"]: {
            categoryLoader: new vseinstrumenti_ru.CategoryProcessor({
                fetcher: fetcher,
                cookieLoader,
            }),
        },
    };
    if (platform in platforms) {
        return platforms[platform];
    }
};
