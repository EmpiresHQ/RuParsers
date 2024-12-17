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
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { API_SETTINGS } from "./settings.js";
import { CategoryProcessor } from "./category_v2.js";
dotenv.config();
const proxy = {
    url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
    auth: (_b = process.env.TEST_PROXY_AUTH) !== null && _b !== void 0 ? _b : "",
};
const cookieLoader = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const proxyUrl = proxyUrlFromType(proxy);
    const res = yield renderer(Object.assign(Object.assign({}, API_SETTINGS.antibotOpts), { proxy: {
            url: proxyUrl,
        } }));
    const cookies = ((_a = res.cookies) !== null && _a !== void 0 ? _a : []).map(({ name, value }) => ({ name, value }));
    // const token = cookies && cookies.find( ({name}) => name == '_ym_uid')
    return {
        cookies,
        headers: { token: "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv" }
    };
});
const loader = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    opts.headers = [
        "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        `Sec-Fetch-Dest: document`,
        "Sec-Fetch-Mode: navigate",
        "Sec-Fetch-Site: cross-site",
        `Sec-ch-ua-platform: "Linux"`,
        ...(_a = opts.headers) !== null && _a !== void 0 ? _a : [],
    ];
    const data = yield curlFetch(Object.assign(Object.assign({}, opts), { version: "V2Tls" }), "json");
    return data;
});
let preloadedCookies;
describe("Lemana", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        preloadedCookies = yield cookieLoader();
    }), 5000000);
    test("lemana:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        const categoryProcessor = new CategoryProcessor({
            fetcher: loader,
            cookieLoader,
        });
        const parsed = yield categoryProcessor.fetchCategory({
            categoryId: "a58305a0-03a1-11ef-9a30-ddd1cb673d49",
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        if ('err' in parsed) {
            throw new Error(JSON.stringify(parsed.err));
        }
        expect(parsed.items[0].skuId).toBeDefined();
        expect(parsed).toBeDefined();
    }), 5000000);
});
