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
import { MEDIA_HOST } from "./settings.js";
export const apiParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ json }) {
    if (!json) {
        return {
            err: BaseProcessorError.Crawler,
        };
    }
    if (Buffer.isBuffer(json)) {
        throw new Error("is a buffer");
    }
    if ("error" in json) {
        throw new Error(JSON.stringify(json.error));
    }
    const items = json
        .filter(({ _source }) => !!_source.url_path)
        .map(({ _source: item }) => ({
        skuId: item.url_path,
        title: item.name,
        regularPrice: (item.final_price_incl_tax * 100).toString(),
        imageUrl: `${MEDIA_HOST}${item.image}`,
        isAvailable: item.stock.is_in_stock,
    }));
    return {
        items,
        hasNextPage: !!items && items.length > 0,
    };
});
