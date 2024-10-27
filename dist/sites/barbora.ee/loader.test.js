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
import { HOST, restRequestOpts } from "./settings.js";
import { curlFetch } from "../../helpers/curl.js";
import { jsParser } from "./category_parser.js";
describe("Barbora.ee loader", () => {
    test("barbora:load products", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const data = restRequestOpts({
            data: {
                text: "piimatooted-ja-munad",
                remoteId: "-1",
            },
        }, 1);
        console.log(data);
        expect(data).toBeDefined();
        const reply = yield curlFetch(Object.assign(Object.assign({}, data), { url: `${HOST}${data.urlPath}`, proxy: {
                url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
                auth: process.env.TEST_PROXY_AUTH,
            } }), "text");
        expect(reply).toBeDefined();
        const parsed = yield jsParser({ html: Buffer.from(reply) });
        expect(parsed).toBeDefined();
        // console.log(JSON.stringify(parsed, null, 2));
    }));
}, 50000);
