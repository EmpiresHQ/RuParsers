import { selver_ee, barbora_ee, lemanapro_ru, vseinstrumenti_ru, dns_shop_ru, ozon_ru, wildberries_ru, } from "./sites/index.js";
export * from "./lib/index.js";
export * from "./sites/index.js";
export const availablePlatforms = {
    "wildberries.ru": {
        strategies: {},
        preferredStrategy: "api",
    },
    "ozon.ru": {
        strategies: {},
        preferredStrategy: "api",
    },
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
    switch (platform) {
        case "wildberries.ru":
            return {
                name: "wildberries.ru",
                categoryLoader: new wildberries_ru.CategoryProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
            };
        case "ozon.ru":
            return {
                name: "ozon.ru",
                categoryLoader: new ozon_ru.OzonCategoryProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
                itemLoader: new ozon_ru.OzonItemProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
            };
        case "lemanapro.ru":
            return {
                name: "lemanapro.ru",
                categoryLoader: new lemanapro_ru.CategoryProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
            };
        case "vseinstrumenti.ru":
            return {
                name: "vseinstrumenti.ru",
                categoryLoader: new vseinstrumenti_ru.CategoryProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
            };
        case "dns-shop.ru":
            return {
                name: "dns-shop.ru",
                categoryLoader: new dns_shop_ru.CategoryProcessor({
                    fetcher: fetcher,
                    cookieLoader,
                }),
            };
        case "selver.ee":
            return {
                name: "selver.ee",
            };
        case "barbora.ee":
            return { name: 'barbora.ee' };
    }
};
