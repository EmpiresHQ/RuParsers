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
import { treeLoader } from "./category_tree.js";
import { renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";
import { API_SETTINGS, apiRequestOpts } from "./settings.js";
import { fetcher } from "./fetcher.js";
import { apiParser } from "./category_parser.js";
dotenv.config();
describe("DNS", () => {
    test("dns:load categories", () => __awaiter(void 0, void 0, void 0, function* () {
        const cats = yield treeLoader({
            preloader: (args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.antibotOpts) {
                    return renderer(args.antibotOpts);
                }
                return { cookies: [] };
            }),
            loader: (rp, cookies) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield curlFetch(Object.assign(Object.assign({}, rp), { cookies }));
                return data;
            }),
        });
        console.log(cats);
        expect(cats).toBeDefined();
    }));
    test("dns:load products", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!API_SETTINGS.antibotOpts) {
            throw new Error("no bot params");
        }
        const { cookies } = yield renderer(API_SETTINGS.antibotOpts);
        const opts = apiRequestOpts({
            data: {
                remoteId: "17a8d26216404e77",
                text: "",
            },
        });
        const data = yield fetcher(opts, (opts) => __awaiter(void 0, void 0, void 0, function* () {
            return curlFetch(Object.assign(Object.assign({}, opts), { cookies }));
        }));
        const ready = yield apiParser({ json: data });
        expect(ready).toBeDefined();
        opts.page = 2;
        const data2 = yield fetcher(opts, (opts) => __awaiter(void 0, void 0, void 0, function* () {
            return curlFetch(Object.assign(Object.assign({}, opts), { cookies }));
        }));
        const ready2 = yield apiParser({ json: data2 });
        console.log(ready2);
        expect(ready2).toBeDefined();
        // console.log(data.json?.assets.inlineJs)
    }));
}, 5000000);
