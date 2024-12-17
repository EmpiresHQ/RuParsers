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
import { AvailablePlatformsv2 } from "../../index.js";
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
    };
});
const loader = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    opts.headers = [
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
describe("VI", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        preloadedCookies = yield cookieLoader();
    }), 5000000);
    test("vi:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        const parser = AvailablePlatformsv2("vseinstrumenti.ru", {
            fetcher: loader,
            cookieLoader,
        });
        if (!parser) {
            throw new Error('VI parser not found');
        }
        const categoryProcessor = parser.categoryLoader;
        const parsed = yield categoryProcessor.fetchCategory({
            categoryId: 15,
            preloadedCookies,
            proxy,
        });
        console.log(parsed);
        expect(parsed).toBeDefined();
    }), 5000000);
});
