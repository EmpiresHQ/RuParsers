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
import { title } from "process";
import { digitMatcher, pagesParser } from "../../lib/index.js";
import * as vm from "node:vm";
export const htmlParser = (html) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!Buffer.isBuffer(html)) {
        throw new Error("not a buffer");
    }
    const $ = cheerio.load(html);
    const currentPage = (_a = $(".pagination-container>a.-active").html()) === null || _a === void 0 ? void 0 : _a.trim();
    const lastPage = (_b = $(".pagination-container>a:last-of-type").html()) === null || _b === void 0 ? void 0 : _b.trim();
    const data = $.extract({
        items: [
            {
                selector: '[data-qa="products-tile"]',
                value: {
                    sku: {
                        selector: '[data-qa="product-code-text"]',
                        value: (el) => digitMatcher($(el).text().trim()),
                    },
                    regularPrice: {
                        selector: '[data-qa="product-price-current"]',
                        value: (el) => $(el).text().trim(),
                    },
                    discountPrice: {
                        selector: '[data-qa="product-personal-price"]',
                        value: (el) => $(el).text().trim(),
                    },
                    title: {
                        selector: '[data-qa="product-name"]>span',
                        value: (el) => $(el).text().trim(),
                    },
                    stock: {
                        selector: '[data-qa="product-availability-total-available"]',
                        value: (el) => {
                            const stock = digitMatcher($(el).text().trim().replace(/\n/g, ""));
                            if (stock) {
                                return stock === "100" ? Infinity : +stock;
                            }
                        },
                    },
                    imageUrl: {
                        selector: '[data-qa="product-photo-click"] img',
                        value: (el) => {
                            return $(el).data("url");
                        },
                    },
                },
            },
        ],
    });
    const items = data.items.map(({ sku, regularPrice, discountPrice, stock, imageUrl }) => ({
        discountPrice,
        stock,
        imageUrl,
        skuId: sku !== null && sku !== void 0 ? sku : "",
        regularPrice: regularPrice !== null && regularPrice !== void 0 ? regularPrice : "",
        title: title !== null && title !== void 0 ? title : "",
        isAvailable: !!stock,
    }));
    return {
        items,
        hasNextPage: currentPage && lastPage ? currentPage < lastPage : false,
    };
});
const _itemMapper = (item) => {
    var _a, _b;
    const { code, pricesV2, name, availabilityInfo, image } = item;
    return {
        title: name,
        skuId: code,
        stock: availabilityInfo.currentlyAvailable,
        imageUrl: image,
        regularPrice: pricesV2.current.toString(),
        discountPrice: (_b = (_a = pricesV2.availableDiscountPrices
            .sort((a, b) => a.price - b.price)) === null || _a === void 0 ? void 0 : _a.shift()) === null || _b === void 0 ? void 0 : _b.price.toString(),
    };
};
export const jsParser = (html) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    if (!Buffer.isBuffer(html)) {
        throw new Error("not a buffer");
    }
    const $ = cheerio.load(html);
    const src = $("script").filter((_, ele) => { var _a; return ((_a = $(ele).html()) !== null && _a !== void 0 ? _a : "").substring(0, 100).indexOf("NUXT") > -1; });
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext((_a = src.html()) !== null && _a !== void 0 ? _a : "undefined", ctx);
    const state = (_b = ctx.window.__NUXT__) === null || _b === void 0 ? void 0 : _b.state;
    const products = (_c = state === null || state === void 0 ? void 0 : state.listing.products) !== null && _c !== void 0 ? _c : {};
    const items = Object.values(products).map(_itemMapper);
    const { hasNextPage } = pagesParser({
        pageNumber: (_d = state === null || state === void 0 ? void 0 : state.listing.pageNumber) !== null && _d !== void 0 ? _d : 0,
        totalProducts: (_e = state === null || state === void 0 ? void 0 : state.listing.productsForPaginationCount) !== null && _e !== void 0 ? _e : 0,
        perPage: (_f = state === null || state === void 0 ? void 0 : state.listing.perPage) !== null && _f !== void 0 ? _f : 40,
    });
    return {
        items,
        hasNextPage,
    };
});
export const apiParser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (Buffer.isBuffer(data)) {
        throw new Error("data should not be buffer");
    }
    const items = data.products.map(_itemMapper);
    const hasNextPage = data.listingSettings.pages.current < data.listingSettings.pages.max;
    return {
        items,
        hasNextPage,
    };
});
