var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RequestBase } from "./request.js";
export class ItemBase {
}
export class BaseClass extends RequestBase {
    fetchItem(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                err: undefined,
            };
        });
    }
    getCookieLoaderParams() {
        return {
            url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/category/7000`)})`,
            waitAfterLoad: 4000,
            getDocumentBody: true,
            fetchCookies: {
                domains: ["https://www.ozon.ru"],
                cookieNames: ["abt_data", "__Secure-ETC", "TS012*"],
            },
        };
    }
}
