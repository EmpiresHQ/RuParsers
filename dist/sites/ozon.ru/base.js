var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { merge } from "lodash";
import lodash from "lodash";
const { merge } = lodash;
import { RequestBase } from "../../base/request.js";
export class OzonBase extends RequestBase {
    constructor(args) {
        super(args);
        this.endpoint = "https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=";
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
    request(_a) {
        return __awaiter(this, arguments, void 0, function* ({ opts: { proxy }, cookiesHeaders: { cookies }, pathLoader, }) {
            const path = this.getPath(pathLoader());
            const data = yield this.fetcher({
                method: "GET",
                proxy,
                cookies: cookies ? cookies : [],
                host: this.endpoint,
                urlPath: path,
            });
            return data;
        });
    }
}
