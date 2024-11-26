import { OzonItemProcessor } from "./item_processor.js";
export class OzonItemMetaProcessor extends OzonItemProcessor {
    getPath({ args }) {
        return encodeURIComponent(`/product/${args[0]}?layout_container=pdpPage2column&layout_page_index=2`);
    }
    process(data) {
        var _a, _b, _c, _d, _e;
        const errChecker = this.checkError(data);
        if (errChecker.err) {
            return { err: errChecker.err };
        }
        const parsed = this.stateParser(data);
        const characteristics = [];
        if ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.webCharacteristics) === null || _a === void 0 ? void 0 : _a.characteristics) {
            const point = parsed === null || parsed === void 0 ? void 0 : parsed.webCharacteristics.characteristics;
            for (const item of point) {
                for (const long of (_b = item.long) !== null && _b !== void 0 ? _b : []) {
                    for (const v of long.values) {
                        characteristics.push({ key: v.key, text: v.text });
                    }
                }
                for (const short of (_c = item.short) !== null && _c !== void 0 ? _c : []) {
                    for (const v of short.values) {
                        characteristics.push({ key: v.key, text: v.text });
                    }
                }
            }
        }
        if ((_d = parsed === null || parsed === void 0 ? void 0 : parsed.webDescription) === null || _d === void 0 ? void 0 : _d.characteristics) {
            const point = parsed.webDescription.characteristics;
            for (const item of point) {
                characteristics.push({ key: item.title, text: item.content });
            }
        }
        if ((_e = parsed === null || parsed === void 0 ? void 0 : parsed.webShortCharacteristics) === null || _e === void 0 ? void 0 : _e.characteristics) {
            const point = parsed.webShortCharacteristics.characteristics;
            for (const item of point) {
                characteristics.push({
                    key: item.id,
                    text: item.values[0].text,
                });
            }
        }
        return {
            characteristics,
        };
    }
    filterStates() {
        return ["webCharacteristics", "webDescription", "webShortCharacteristics"];
    }
}
