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
import { apiRequestOpts } from "./settings.js";
import { fetcher } from "./fetcher.js";
import * as dotenv from "dotenv";
import { treeParser } from "./category_tree.js";
dotenv.config();
describe("Selver.ee", () => {
    test("selver:load products", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const opts = yield apiRequestOpts({
            data: {
                remoteId: "210",
                text: "210",
            },
        });
        opts.proxy = {
            url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
            auth: process.env.TEST_PROXY_AUTH,
        };
        const data = yield fetcher(opts);
        if (data.json && "error" in data.json) {
            console.log(data.json.error);
        }
        else {
            console.log(JSON.stringify((_b = data.json) === null || _b === void 0 ? void 0 : _b.map((p) => p._source.url_path), null, 2));
        }
        expect(data).toBeDefined();
    }));
    test("selver:load categories", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const cats = yield treeParser({
            proxy: {
                url: (_a = process.env.TEST_PROXY_URL) !== null && _a !== void 0 ? _a : "",
                auth: process.env.TEST_PROXY_AUTH,
            },
        });
        expect(cats).toBeDefined();
    }));
}, 50000);
