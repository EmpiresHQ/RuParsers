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
import { BaseProcessorError } from "../../types/error.js";
import { apiParser } from "./category_parser.js";
import { API_SETTINGS, WEB_HOST, } from "./index.js";
import * as vm from "node:vm";
export class CategoryProcessor extends RequestBase {
    getCookieLoaderParams() {
        return Object.assign({}, API_SETTINGS.antibotOpts);
    }
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryUrl, preloadedCookies, proxy, page = 1, }) {
            if (!categoryUrl) {
                throw new Error("no category url");
            }
            const { cookies, headers } = yield this.getCookies({
                preloadedCookies,
                proxy,
            });
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const { data } = yield this.fetcher({
                urlPath: categoryUrl.indexOf("virtual_category_uid") > -1
                    ? page > 0
                        ? `${categoryUrl !== null && categoryUrl !== void 0 ? categoryUrl : ""}&p=${page}`
                        : `${categoryUrl !== null && categoryUrl !== void 0 ? categoryUrl : ""}`
                    : `${categoryUrl !== null && categoryUrl !== void 0 ? categoryUrl : ""}/?p=${page}`,
                host: WEB_HOST,
                method: "GET",
                timeout: 15,
                cookies,
                proxy,
                headers: [
                    "Content-Type: application/json",
                    `cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5`,
                    `x-requested-with: XMLHttpRequest`,
                ],
            });
            if (data) {
                if (typeof data !== "object" || !data.assets || !data.assets.inlineJs) {
                    return {
                        err: BaseProcessorError.NotFound,
                    };
                }
                const productContainer = Object.entries(data.assets.inlineJs).find(([, value]) => {
                    return value.includes("AjaxState.register");
                });
                if (!productContainer) {
                    return {
                        items: [],
                    };
                }
                const productsString = data.assets.inlineJs[productContainer[0]];
                let store = [];
                const ctx = {
                    window: {
                        AjaxState: {
                            register: (data) => {
                                store = data;
                            },
                        },
                    },
                };
                vm.createContext(ctx);
                vm.runInContext(productsString, ctx);
                if (!store || !store.length) {
                    // return {
                    //   error: "notparsed",
                    // };
                    return {
                        items: [],
                    };
                }
                const chunk = store.find((chunk) => chunk[0].type === "product-buy");
                if (!chunk && (!page || page == 1)) {
                    return {
                        err: BaseProcessorError.NotFound,
                    };
                }
                if (!chunk || chunk.length < 2) {
                    // return {
                    //   error: "noproducts",
                    // };
                    return {
                        items: [],
                    };
                }
                const pricePayload = chunk[1].map(({ id, data: { id: dId } }) => ({
                    id,
                    data: { id: dId },
                }));
                const priceData = yield this.fetchPrices(pricePayload, cookies);
                const productIds = priceData.data.states.map((state) => state.data.id);
                const imageData = yield this.fetchImages(productIds, cookies);
                const unparsed = priceData.data.states.map((state) => (Object.assign(Object.assign({}, state), { images: imageData.data[state.data.id] })));
                const parsed = yield apiParser({ json: unparsed });
                if ("err" in parsed) {
                    return { err: parsed.err };
                }
                if (parsed.items) {
                    const items = parsed.items;
                    return Object.assign(Object.assign({}, parsed), { items, cookiesHeaders: {
                            cookies, headers
                        } });
                }
            }
            return {
                err: undefined,
            };
        });
    }
    fetchImages(productIds, cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: respData } = yield this.untypedFetcher({
                urlPath: `/catalog/product/get-images/`,
                host: WEB_HOST,
                method: "POST",
                headers: [
                    "Content-Type: application/x-www-form-urlencoded",
                    "accept: */*",
                    `x-requested-with: XMLHttpRequest`,
                ],
                raw: `ids=${JSON.stringify(productIds)}`,
                cookies,
            });
            return respData;
        });
    }
    fetchPrices(pl, cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { type: "product-buy", containers: pl };
            const { data: respData } = yield this.untypedFetcher({
                urlPath: `/ajax-state/product-buy/`,
                host: WEB_HOST,
                method: "POST",
                headers: [
                    "Content-Type: application/x-www-form-urlencoded",
                    "accept: */*",
                    `x-requested-with: XMLHttpRequest`,
                ],
                raw: `data=${JSON.stringify(data)}`,
                cookies,
            });
            return respData;
        });
    }
}
