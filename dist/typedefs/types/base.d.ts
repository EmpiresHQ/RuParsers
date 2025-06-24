import { wildberries_ru, lemanapro_ru, vseinstrumenti_ru, dns_shop_ru, ozon_ru } from "../sites/index.js";
export interface SimpleCookie {
    name: string;
    value: string;
}
export type PlatformProcesors = {
    name: "wildberries.ru";
    categoryLoader: wildberries_ru.CategoryProcessor;
} | {
    name: "ozon.ru";
    categoryLoader: ozon_ru.OzonCategoryProcessor;
    itemLoader: ozon_ru.OzonItemProcessor;
} | {
    name: "vseinstrumenti.ru";
    categoryLoader: vseinstrumenti_ru.CategoryProcessor;
} | {
    name: "lemanapro.ru";
    categoryLoader: lemanapro_ru.CategoryProcessor;
} | {
    name: "barbora.ee";
} | {
    name: "selver.ee";
} | {
    name: "dns-shop.ru";
    categoryLoader: dns_shop_ru.CategoryProcessor;
};
//# sourceMappingURL=base.d.ts.map