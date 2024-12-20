var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseProcessorError } from "../../types/error.js";
const _itemMapper = ({ data: { id, name, price, notAvail }, images, }) => (Object.assign(Object.assign({
    skuId: id,
    title: name,
    imageUrl: images && images[0],
    isAvailable: true,
}, (price
    ? { regularPrice: ((price.current || 0) * 100).toString() }
    : { regularPrice: "0" })), (notAvail ? { isAvailable: false } : {})));
export const apiParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ json, }) {
    if (!json || "error" in json) {
        if ((json === null || json === void 0 ? void 0 : json.error) &&
            ["notfound", "notparsed", "noproducts"].includes(json.error)) {
            return {
                items: [],
                hasNextPage: false,
            };
        }
        if ((json === null || json === void 0 ? void 0 : json.error) === BaseProcessorError.NotFound) {
            return { err: json.error };
        }
        return {
            err: BaseProcessorError.Crawler,
        };
    }
    const items = json
        .filter((i) => i.data.price && i.data.price.current)
        .map(_itemMapper);
    const hasNextPage = items.length > 0;
    return {
        items,
        hasNextPage,
    };
});
