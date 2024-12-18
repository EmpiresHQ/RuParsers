var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class RequestBase {
    constructor({ fetcher, cookieLoader }) {
        this.fetcher = fetcher;
        this.cookieLoader = cookieLoader;
    }
    readCookies({ headers, existing, merge = true, }) {
        const found = headers.find((chunk) => !!chunk["Set-Cookie"]);
        if (found) {
            const newCookies = found["Set-Cookie"].map((cookie) => this.parseSetCookieHeader(cookie)).filter(c => !!c.value.trim());
            if (existing && merge) {
                const notOverriden = existing.filter(e => !newCookies.find(n => n.name === e.name));
                return [
                    ...newCookies,
                    ...notOverriden
                ];
            }
        }
    }
    parseSetCookieHeader(cookieStr) {
        const parts = cookieStr.split(";").map((part) => part.trim());
        const [nameValuePair, ...attributes] = parts;
        // Parse the name and value
        const [name, ...valueParts] = nameValuePair.split("=");
        const value = valueParts.join("=");
        // Build the cookie object
        const cookie = { name, value: decodeURIComponent(value) };
        // Parse attributes like Path, Secure, HttpOnly, etc.
        for (const attribute of attributes) {
            const [attrName, attrValue] = attribute.split("=");
            const key = attrName.trim();
            if (key === "Secure" || key === "HttpOnly") {
                cookie[key] = true; // Boolean attributes
            }
            else if (key === "SameSite") {
                cookie[key] = attrValue === null || attrValue === void 0 ? void 0 : attrValue.trim();
            }
            else if (attrValue) {
                cookie[key] = decodeURIComponent(attrValue.trim());
            }
        }
        return cookie;
    }
    getCookies(_a) {
        return __awaiter(this, arguments, void 0, function* ({ proxy, preloadedCookies, }) {
            if (preloadedCookies) {
                return preloadedCookies;
            }
            const params = this.getCookieLoaderParams();
            params.proxy = proxy;
            const data = this.cookieLoader(params);
            return data;
        });
    }
}
