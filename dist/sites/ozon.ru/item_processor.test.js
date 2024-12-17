var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { OzonItemProcessor } from "./item_processor.js";
import { OzonItemMetaProcessor } from "./item_meta_processor.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { OzonCategoryProcessor } from "./category_processor.js";
import { OzonSellerCategoryProcessor } from "./seller_category_processor.js";
dotenv.config();
const proxy = {
    url: (_a = process.env.TEST_OZON_PROXY_URL) !== null && _a !== void 0 ? _a : "",
    auth: (_b = process.env.TEST_OZON_PROXY_AUTH) !== null && _b !== void 0 ? _b : "",
};
const cookieLoader = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const proxyUrl = proxyUrlFromType(proxy);
    const res = yield renderer({
        url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/product/1428983821`)})`,
        waitAfterLoad: 4000,
        getDocumentBody: true,
        fetchCookies: {
            domains: ["https://www.ozon.ru"],
            cookieNames: ["abt_data", "__Secure-ETC"],
        },
        proxy: {
            url: proxyUrl,
        },
    });
    return {
        cookies: ((_a = res.cookies) !== null && _a !== void 0 ? _a : []).map(({ name, value }) => ({ name, value })),
    };
});
const loader = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    opts.headers = [
        "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        `Sec-Fetch-Dest: document`,
        "Sec-Fetch-Mode: navigate",
        "Sec-Fetch-Site: cross-site",
        `Sec-ch-ua-platform: "Linux"`,
    ];
    const data = yield curlFetch(Object.assign(Object.assign({}, opts), { version: "V2Tls" }), "json");
    return data;
});
let preloadedCookies;
describe("OZON", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        preloadedCookies = yield cookieLoader();
    }), 5000000);
    test("ozon:load item", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonItemProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield itemProcessor.fetchItem({
            itemId: "1428983821",
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    test("ozon:load meta item", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonItemMetaProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield itemProcessor.fetchItem({
            itemId: "1428983821",
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    test("ozon:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonCategoryProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield Promise.all([1, 2].map((i) => itemProcessor.fetchCategory({
            categoryId: "smartfony-15502",
            page: i,
            preloadedCookies,
            proxy,
        })));
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    test("ozon:seller category", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonSellerCategoryProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield itemProcessor.fetchCategory({
            sellerId: "1456889",
            categoryId: "",
            page: 1,
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    test.only("ozon:seller category subtree", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonSellerCategoryProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield itemProcessor.fetchSubcategories({
            sellerId: "1456889",
            categoryId: "",
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
}, 5000000);
