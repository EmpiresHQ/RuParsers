var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cheerio from "cheerio";
import * as vm from "node:vm";
// https://production-elb.barbora.lt/api/cache/v1/country/EE/categories
const _itemMapper = (item) => ({
    title: item.title,
    skuId: item.Url,
    imageUrl: item.big_image,
    isAvailable: item.status === 'active',
    regularPrice: (item.price * 100).toString(),
    units: item.units,
});
export const jsParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ html }) {
    var _b, _c;
    if (!Buffer.isBuffer(html)) {
        throw new Error("not a buffer");
    }
    const $ = cheerio.load(html);
    const src = $("script").filter((_, ele) => { var _a; return ((_a = $(ele).html()) !== null && _a !== void 0 ? _a : "").substring(0, 100).indexOf("b_productList") > -1; });
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext((_b = src.html()) !== null && _b !== void 0 ? _b : "undefined", ctx);
    const products = (_c = ctx.window.b_productList) !== null && _c !== void 0 ? _c : [];
    const items = products.map(_itemMapper);
    const hasNextPage = items.length > 0;
    return {
        items,
        hasNextPage
    };
});
