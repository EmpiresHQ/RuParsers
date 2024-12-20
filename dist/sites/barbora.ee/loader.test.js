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
import { treeParser } from "./category_tree.js";
import * as dotenv from "dotenv";
dotenv.config();
describe("Barbora.ee", () => {
    test("barbora:load products", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const data = restRequestOpts({
            data: {
                text: "kodukaubad-ja-vaba-aeg/ajalehed-ajakirjad-ristsonad",
                remoteId: "-1",
            },
        }, 7);
        expect(data).toBeDefined();
        const reply = yield curlFetch(Object.assign(Object.assign({}, data), { url: `${HOST}${data.urlPath}`, proxy: {
                url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
                auth: process.env.TEST_PROXY_AUTH,
            } }), "text");
        expect(reply).toBeDefined();
        console.log(JSON.stringify(reply, null, 2));
        const parsed = yield jsParser({ html: Buffer.from(reply) });
        expect(parsed).toBeDefined();
        console.log(JSON.stringify(parsed, null, 2));
    }));
    test("barbora:load categories", () => __awaiter(void 0, void 0, void 0, function* () {
        const loader = (url) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            console.log(url);
            const data = yield curlFetch({
                url,
                method: "GET",
                proxy: {
                    url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
                    auth: process.env.TEST_PROXY_AUTH,
                },
            }, 'json');
            console.log(data);
            return data;
        });
        const categories = yield treeParser({ loader });
        console.log(categories);
        expect(categories).toBeDefined();
    }));
}, 50000);
