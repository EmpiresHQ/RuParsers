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
import { AvailablePlatformsv2 } from "../../index.js";
import { cookieLoader, loader, proxy } from "../../base/index.js";
let preloadedCookies = undefined;
describe("DNS", () => {
    test("dns:load category", () => __awaiter(void 0, void 0, void 0, function* () {
        const parser = AvailablePlatformsv2("dns-shop.ru", {
            fetcher: loader,
            cookieLoader,
        });
        if (!parser) {
            throw new Error('VI parser not found');
        }
        const data = [];
        for (const page of [1, 2]) {
            const parsed = yield parser.categoryLoader.fetchCategory({
                categoryId: "234c1343852e5710",
                categoryUrl: "/catalog/recipe/234c1343852e5710/akkumulatornye-batarei/",
                proxy,
                page,
                preloadedCookies,
            });
            if (!parsed || 'err' in parsed) {
                throw new Error('not parsed');
            }
            if (parsed.cookiesHeaders) {
                preloadedCookies = parsed.cookiesHeaders;
            }
            data.push(parsed);
        }
        console.log(data);
        expect(data[0].items).toBeDefined();
    }), 5000000);
});
