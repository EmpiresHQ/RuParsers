import { OzonItemProcessor } from "./item_processor.js";
export class OzonItemMetaProcessor extends OzonItemProcessor {
    getPath(itemId) {
        return encodeURIComponent(`/product/${itemId}?layout_container=pdpPage2column&layout_page_index=2`);
    }
    process(data) {
        var _a, _b, _c;
        const errChecker = this.checkError(data);
        if (errChecker.err) {
            return { err: errChecker.err };
        }
        const parsed = this.stateParser(data);
        const characteristics = [];
        if (parsed.webCharacteristics.characteristics) {
            const point = parsed === null || parsed === void 0 ? void 0 : parsed.webCharacteristics.characteristics;
            for (const item of point) {
                for (const long of (_a = item.long) !== null && _a !== void 0 ? _a : []) {
                    for (const v of long.values) {
                        characteristics.push({ key: v.key, text: v.text });
                    }
                }
                for (const short of (_b = item.short) !== null && _b !== void 0 ? _b : []) {
                    for (const v of short.values) {
                        characteristics.push({ key: v.key, text: v.text });
                    }
                }
            }
            if ((_c = parsed === null || parsed === void 0 ? void 0 : parsed.webDescription) === null || _c === void 0 ? void 0 : _c.characteristics) {
                const point = parsed.webDescription.characteristics;
                for (const item of point) {
                    characteristics.push({ key: item.title, text: item.content });
                }
            }
            return {
                item: characteristics
            };
        }
        return {};
    }
    filterStates() {
        return [
            "webCharacteristics",
            "webDescription"
        ];
    }
}
