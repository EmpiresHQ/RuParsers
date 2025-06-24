var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d;
import * as dotenv from "dotenv";
import { curlFetch } from "../helpers/curl.js";
import { proxyUrlFromType, renderer } from "../helpers/renderer.js";
dotenv.config();
export const proxy = {
    url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
    auth: (_b = process.env.TEST_PROXY_AUTH) !== null && _b !== void 0 ? _b : "",
};
export const ozonProxy = {
    url: (_c = process.env.TEST_OZON_PROXY_URL) !== null && _c !== void 0 ? _c : "",
    auth: (_d = process.env.TEST_OZON_PROXY_AUTH) !== null && _d !== void 0 ? _d : "",
};
export const cookieLoader = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (opts = {}) {
    var _a;
    const proxyUrl = proxyUrlFromType(proxy);
    const res = yield renderer(Object.assign(Object.assign({}, opts), { proxy: {
            url: proxyUrl,
        } }));
    const cookies = ((_a = res.cookies) !== null && _a !== void 0 ? _a : []).map(({ name, value }) => ({ name, value }));
    // const token = cookies && cookies.find( ({name}) => name == '_ym_uid')
    return {
        cookies,
    };
});
export const loader = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    return curlFetch(opts, "json");
});
