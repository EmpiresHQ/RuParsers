var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { beforeAll, describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { proxyUrlFromType } from "../../helpers/renderer.js";
import { cookieLoader, loader, ozonProxy } from "../../base/index.js";
import { AvailablePlatformsv2 } from "../../index.js";
dotenv.config();
let preloadedCookies;
let parser;
describe("OZON", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        preloadedCookies = yield cookieLoader({
            url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/product/1428983821`)})`,
            waitAfterLoad: 4000,
            getDocumentBody: true,
            fetchCookies: {
                domains: ["https://www.ozon.ru"],
                cookieNames: ["abt_data", "__Secure-ETC"],
            },
            proxy: {
                url: proxyUrlFromType(ozonProxy),
            },
        });
        parser = AvailablePlatformsv2("ozon.ru", {
            fetcher: loader,
            cookieLoader,
        });
    }), 5000000);
    test("ozon:load item", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const parsed = yield ((_a = parser === null || parser === void 0 ? void 0 : parser.itemLoader) === null || _a === void 0 ? void 0 : _a.fetchItem({
            itemId: "1428983821",
            preloadedCookies,
            proxy: ozonProxy,
        }));
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    // test("ozon:load meta item", async () => {
    //   const itemProcessor = new OzonItemMetaProcessor({
    //     fetcher: loader,
    //     cookieLoader,
    //   });
    //   const parsed = await itemProcessor.fetchItem({
    //     itemId: "1428983821",
    //     preloadedCookies,
    //     proxy,
    //   });
    //   console.log(parsed);
    //   expect(parsed).toBeDefined();
    // });
    test.only("ozon:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const parsed = [];
        for (const page of [1, 2]) {
            const data = yield ((_a = parser === null || parser === void 0 ? void 0 : parser.categoryLoader) === null || _a === void 0 ? void 0 : _a.fetchCategory({
                categoryId: "smartfony-15502",
                page,
                preloadedCookies,
                proxy: ozonProxy,
            }));
            if (!data || "err" in data) {
                throw new Error("parse failed");
            }
            preloadedCookies.cookies = (_b = data.cookiesHeaders) === null || _b === void 0 ? void 0 : _b.cookies;
            parsed.push(data);
        }
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    // test("ozon:seller category", async () => {
    //   const itemProcessor = new OzonSellerCategoryProcessor({
    //     fetcher: loader as Fetcher<CategoryResponseData>,
    //     cookieLoader,
    //   });
    //   const parsed = await itemProcessor.fetchCategory({
    //     sellerId: "1456889",
    //     categoryId: "",
    //     page: 1,
    //     preloadedCookies,
    //     proxy,
    //   });
    //   console.log(parsed);
    //   expect(parsed).toBeDefined();
    // });
    // test.only("ozon:seller category subtree", async () => {
    //   const itemProcessor = new OzonSellerCategoryProcessor({
    //     fetcher: loader as Fetcher<CategoryResponseData>,
    //     cookieLoader,
    //   });
    //   const parsed = await itemProcessor.fetchSubcategories({
    //     sellerId: "1456889",
    //     categoryId: "",
    //     preloadedCookies,
    //     proxy,
    //   });
    //   console.log(parsed);
    //   expect(parsed).toBeDefined();
    // });
}, 5000000);
