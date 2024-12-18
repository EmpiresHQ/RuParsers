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
import { categoryItemsParser } from "./parsers/search_results_v2.js";
export class OzonCategoryProcessor extends OzonBase {
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, categoryUrl, preloadedCookies, proxy, page = 1, }) {
            // eslint-disable-next-line prefer-const
            let { cookies, headers } = yield this.getCookies({ preloadedCookies, proxy });
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const data = yield this.request({
                opts: { proxy },
                cookiesHeaders: { cookies },
                pathLoader: () => ({
                    args: [categoryId, page.toString()],
                    nextUrl: categoryUrl,
                }),
                cookieCallback: (ccks => {
                    cookies = ccks;
                })
            });
            const parsed = this.process(data);
            return Object.assign(Object.assign({}, parsed), { cookiesHeaders: {
                    cookies,
                    headers
                } });
        });
    }
    getPath({ args, nextUrl }) {
        if (nextUrl) {
            return encodeURIComponent(nextUrl);
        }
        const pagePart = +args[1] > 1
            ? `?layout_container=categorySearchMegapagination&layout_page_index=${args[1]}&page=${args[1]}`
            : "";
        return encodeURIComponent(`/category/${args[0]}/${pagePart}`);
    }
    process(data) {
        var _a, _b;
        const errChecker = this.checkError(data);
        if (errChecker.err) {
            return { err: errChecker.err };
        }
        const parsed = this.stateParser(data);
        let items = [];
        if (parsed.searchResultsV2) {
            items = categoryItemsParser(parsed.searchResultsV2);
        }
        const nextPage = (_a = data === null || data === void 0 ? void 0 : data.nextPage) !== null && _a !== void 0 ? _a : (_b = parsed === null || parsed === void 0 ? void 0 : parsed.megaPaginator) === null || _b === void 0 ? void 0 : _b.nextPage;
        return {
            hasNextPage: !!(nextPage && nextPage.indexOf("sold_out_page") < 0),
            items,
            nextPage,
        };
    }
    filterStates() {
        return [
            "searchResultsV2",
            "tagList",
            "filtersDesktop",
            "ResultsHeader",
            "tileGrid2",
            "skuGrid2",
            "userAdultModal",
            "megaPaginator",
            "no_results",
        ];
    }
}
