var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { curlFetch } from "../../helpers/curl.js";
import { OzonItemProcessor } from "./item_processor.js";
import { OzonItemMetaProcessor } from "./item_meta_processor.js";
dotenv.config();
const cookies = [
    {
        name: "abt_data",
        value: "xxx",
    },
    {
        name: "__Secure-ETC",
        value: "xxx",
    },
];
const proxy = {
    url: "xxx",
    auth: "xxx",
};
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
describe("OZON", () => {
    test("ozon:load item", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonItemProcessor({
            fetcher: loader,
            cookieLoader: () => cookies,
        });
        const parsed = yield itemProcessor.fetchItem({
            itemId: "1428983821",
            // preloadedCookies: [],
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
    test.only("ozon:load meta item", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemProcessor = new OzonItemMetaProcessor({
            fetcher: loader,
            cookieLoader: () => cookies,
        });
        const parsed = yield itemProcessor.fetchItem({
            itemId: "1428983821",
            // preloadedCookies: [],
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }));
}, 5000000);
