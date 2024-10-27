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
import { API_HOST, API_SETTINGS, apiRequestOpts } from "./settings.js";
import { renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";
describe("Vseinstrumenti.ru loader", () => {
    test("load products", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!API_SETTINGS.antibotOpts) {
            throw new Error('not antobot params');
        }
        const response = yield renderer(API_SETTINGS.antibotOpts);
        expect(response).toBeDefined();
        const data = apiRequestOpts({
            data: {
                text: "akkumulyatornye-dreli-shurupoverty-15",
                remoteId: "2392",
                meta: {
                    antibotData: response
                }
            }
        }, 1);
        console.log(data);
        expect(data).toBeDefined();
        const reply = yield curlFetch(Object.assign(Object.assign({}, data), { cookies: response.cookies, url: `${API_HOST}${data.urlPath}`, proxy: {
                url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
                auth: process.env.TEST_PROXY_AUTH
            } }));
        expect(reply).toBeDefined();
        console.log(reply);
    }));
}, 50000);
