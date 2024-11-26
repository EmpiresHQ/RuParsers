var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OzonBase } from "./base.js";
export class OzonItemProcessor extends OzonBase {
    fetchItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ itemId, preloadedCookies, proxy }) {
            const cookies = yield this.getCookies({ preloadedCookies, proxy });
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const data = yield this.request({
                opts: { proxy },
                cookies,
                pathLoader: () => ({ args: [itemId] }),
            });
            const parsed = this.process(data);
            return Object.assign(Object.assign({}, parsed), { cookies });
        });
    }
    getPath({ args }) {
        return encodeURIComponent(`/product/${args[0]}`);
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
