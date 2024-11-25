var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { merge } from "lodash";
export class OzonItemProcessor {
    constructor({ fetcher, cookieLoader }) {
        this.endpoint = "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";
        this.fetcher = fetcher;
        this.cookieLoader = cookieLoader;
    }
    fetchItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ itemId, preloadedCookies, proxy }) {
            const cookies = yield this._getCookies({ preloadedCookies, proxy });
            const data = yield this.itemRequest({
                opts: { itemId, proxy },
                cookies,
            });
            const parsed = this.process(data);
            return parsed;
        });
    }
    getPath(itemId) {
        return encodeURIComponent(`/product/${itemId}`);
    }
    itemRequest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ opts: { itemId, proxy }, cookies, }) {
            const data = yield this.fetcher({
                method: "GET",
                proxy,
                cookies,
                host: this.endpoint,
                urlPath: this.getPath(itemId),
            });
            return data;
        });
    }
    _getCookies(_a) {
        return __awaiter(this, arguments, void 0, function* ({ proxy, preloadedCookies, }) {
            if (preloadedCookies) {
                return preloadedCookies;
            }
            return this.cookieLoader(proxy);
        });
    }
    checkError(data) {
        var _a;
        if (!data ||
            data.incidentId ||
            ((_a = data.pageInfo) === null || _a === void 0 ? void 0 : _a.pageType) === "error" ||
            !data.widgetStates) {
            if (data.incidentId) {
                console.log("challenge: ", data.challengeURL);
                console.log("incident: ", data.incidentId);
                console.log(data);
            }
            return {
                err: data.incidentId ? "crawler" : "notfound",
            };
        }
        return { ok: true };
    }
    stateParser(data) {
        const keys = Object.keys(data.widgetStates).filter((k) => this.filterStates().find((s) => k.indexOf(s) > -1));
        // console.log(data.widgetStates)
        const parsed = keys.reduce((sum, k) => {
            var _a;
            const key = (_a = this.filterStates().find((f) => k.indexOf(f) > -1)) !== null && _a !== void 0 ? _a : "";
            return Object.assign(Object.assign({}, sum), {
                [key]: sum[key]
                    ? merge(sum[key], JSON.parse(data.widgetStates[k]))
                    : JSON.parse(data.widgetStates[k]),
            });
        }, {});
        return parsed;
    }
    process(data) {
        const errChecker = this.checkError(data);
        if (errChecker.err) {
            return { err: errChecker.err };
        }
        const parsed = this.stateParser(data);
        if (parsed.userAdultModal) {
            return {
                err: "adult",
            };
        }
        // console.log(resp.url)
        // console.log(parsed.tileGrid2);
        // console.log(JSON.stringify(parsed.searchResultsV2, null ,2));
        // const items = categoryItemsParser(parsed.searchResultsV2);
        let item = undefined;
        if (parsed.webOutOfStock) {
            item = {
                isAvailable: false,
                skuId: parsed.webOutOfStock.sku,
                regularPrice: "",
            };
        }
        if (parsed["webPrice-"]) {
            item = this.itemParser({
                webPrice: parsed["webPrice-"],
                sku: parsed.webReviewProductScore
                    ? parsed.webReviewProductScore.itemId.toString()
                    : parsed.webProductMainWidget
                        ? parsed.webProductMainWidget.sku
                        : parsed.webAddToFavorite.sku,
            });
        }
        // throw "die";
        return {
            item,
        };
    }
    itemParser({ webPrice, sku, }) {
        return {
            skuId: sku,
            discountPrice: webPrice.cardPrice,
            regularPrice: webPrice.originalPrice,
            isAvailable: webPrice.isAvailable,
        };
    }
    filterStates() {
        return [
            "webPrice-",
            "userAdultModal",
            "webReviewProductScore",
            "webOutOfStock",
            "webProductMainWidget",
            "webAddToFavorite",
        ];
    }
}
