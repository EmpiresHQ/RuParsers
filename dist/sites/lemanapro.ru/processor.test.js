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
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";
dotenv.config();
let preloadedCookies = undefined;
describe("Lemana", () => {
    // beforeAll(async () => {
    //   preloadedCookies = await cookieLoader();
    // }, 5000000);
    test("lemana:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        const parser = AvailablePlatformsv2("lemanapro.ru", {
            fetcher: loader,
            cookieLoader,
        });
        if (!parser) {
            throw new Error("VI parser not found");
        }
        const categoryProcessor = parser.categoryLoader;
        const data = [];
        for (const page of [1, 2]) {
            const parsed = yield categoryProcessor.fetchCategory({
                categoryId: "a58305a0-03a1-11ef-9a30-ddd1cb673d49",
                page,
                preloadedCookies,
                proxy,
            });
            if (!parsed || 'err' in parsed) {
                throw new Error('lemana parse failed');
            }
            if (parsed.cookiesHeaders) {
                preloadedCookies = parsed.cookiesHeaders;
            }
            data.push(parsed);
        }
        expect(data.length).toBe(2);
        expect(data[0].items[0].skuId).toBeDefined();
        expect(data).toBeDefined();
    }), 5000000);
});
