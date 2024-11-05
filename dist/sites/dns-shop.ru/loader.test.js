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
dotenv.config();
describe("DNS", () => {
    test("dns:load products", () => __awaiter(void 0, void 0, void 0, function* () {
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
            })
        });
        expect(cats).toBeDefined();
    }));
}, 5000000);
