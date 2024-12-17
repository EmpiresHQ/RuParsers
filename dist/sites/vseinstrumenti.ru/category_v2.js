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
import { API_HOST, API_SETTINGS, apiParser } from "./index.js";
export class CategoryProcessor extends RequestBase {
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, preloadedCookies, proxy, page = 1, }) {
            const { cookies, headers } = yield this.getCookies({
                preloadedCookies,
                proxy,
            });
            const acctoken = cookies === null || cookies === void 0 ? void 0 : cookies.find(({ name }) => name === "acctoken");
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const data = yield this.fetcher({
                urlPath: `/api/category/load?short=true`,
                host: API_HOST,
                method: "POST",
                timeout: 15,
                cookies,
                proxy,
                headers: [
                    "Content-Type: application/json",
                    `Token: ${acctoken === null || acctoken === void 0 ? void 0 : acctoken.value}`,
                ],
                payload: {
                    listingType: "category",
                    id: categoryId,
                    page: {
                        number: page,
                        perPage: API_SETTINGS.perPage,
                    },
                },
            });
            if (data) {
                const parsed = yield apiParser({ json: data });
                if (parsed && parsed.items) {
                    return {
                        items: parsed.items,
                        cookiesHeaders: { cookies, headers },
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
