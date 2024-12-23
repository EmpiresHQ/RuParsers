var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RequestBase, } from "../../base/index.js";
import { categoryProcessor } from "./parsers/category_response.js";
export class CategoryProcessor extends RequestBase {
    getCookieLoaderParams() {
        return {};
    }
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, shard, key = "cat", 
        // preloadedCookies,
        // proxy,
        page = 1, }) {
            // const { cookies, headers } = await this.getCookies({
            //   preloadedCookies,
            //   proxy,
            // });
            // if (!cookies) {
            //   throw new Error("could not fetch cookies");
            // }
            const { data } = yield this.fetcher({
                host: "https://catalog.wb.ru",
                version: "V2Tls",
                urlPath: page > 1
                    ? `/catalog/${shard}/catalog?ab_testing=false&appType=64&${key}=${categoryId}&curr=rub&dest=-1255563&lang=ru&locale=ru&spp=30&page=${page}`
                    : `/catalog/${shard}/catalog?ab_testing=false&appType=64&${key}=${categoryId}&curr=rub&dest=-1255563&lang=ru&locale=ru&spp=30`,
                cookies: [],
                method: "GET",
            });
            if (data) {
                const parsed = yield categoryProcessor(data);
                if ("err" in parsed) {
                    return { err: parsed.err };
                }
                if (parsed.items) {
                    return {
                        items: parsed.items,
                        hasNextPage: parsed.hasNextPage,
                    };
                }
            }
            return {
                err: undefined,
            };
        });
    }
}
