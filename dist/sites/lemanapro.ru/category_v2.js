var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RequestBase } from "../../base/index.js";
import { apiParser } from "./category_parser.js";
import { API_HOST, API_SETTINGS } from "./settings.js";
export class CategoryProcessor extends RequestBase {
    getCookieLoaderParams() {
        return Object.assign({}, API_SETTINGS.antibotOpts);
    }
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, preloadedCookies, proxy, page = 1, }) {
            // eslint-disable-next-line prefer-const
            let { cookies, headers } = yield this.getCookies({
                preloadedCookies,
                proxy,
            });
            headers !== null && headers !== void 0 ? headers : (headers = {});
            headers.token = "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv";
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const { data, headers: rcvHeaders } = yield this.fetcher({
                method: "POST",
                host: API_HOST,
                urlPath: `/hybrid/v1/getProducts?lang=ru`,
                proxy,
                headers: [
                    "Content-Type: application/json",
                    `x-api-key: ${headers === null || headers === void 0 ? void 0 : headers.token}`,
                ],
                cookies,
                payload: {
                    familyIds: [categoryId !== null && categoryId !== void 0 ? categoryId : ""],
                    regionId: "34",
                    suggest: true,
                    limit: 30,
                    offset: page * 30,
                },
            });
            let newCookies;
            if (rcvHeaders) {
                newCookies = this.readCookies({ headers: rcvHeaders, existing: cookies });
            }
            if (data) {
                const parsed = yield apiParser({ json: data });
                if (parsed && parsed.items) {
                    return {
                        items: parsed.items,
                        cookiesHeaders: { cookies: newCookies !== null && newCookies !== void 0 ? newCookies : cookies, headers },
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
