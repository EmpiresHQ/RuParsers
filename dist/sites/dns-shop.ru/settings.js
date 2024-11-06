export const API_HOST = "https://restapi.dns-shop.ru/v1";
export const WEB_HOST = "https://www.dns-shop.ru";
export const API_SETTINGS = {
    antibotOpts: {
        url: `${WEB_HOST}`,
        waitAfterLoad: 4000,
        fetchCookies: {
            domains: ["https://dns-shop.ru"],
            cookieNames: ["qrator_jsid"],
        },
    },
    perPage: 17,
};
export const categoryRequestOpts = () => {
    return {
        urlPath: `/get-menu?maxMenuLevel=3`,
        host: API_HOST,
        method: "GET",
        headers: ["Content-Type: application/json"],
        remoteCategoryId: "",
    };
};
export const apiRequestOpts = (handler, page = 0) => {
    var _a, _b;
    return {
        urlPath: `/catalog/${(_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : ""}/?p=${page}`,
        host: WEB_HOST,
        method: "GET",
        headers: [
            "Content-Type: application/json",
            `cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5`,
            `x-requested-with: XMLHttpRequest`,
        ],
        remoteCategoryId: (_b = handler.data.remoteId) !== null && _b !== void 0 ? _b : "",
        page,
    };
};
export const priceRequestOpts = (pl) => {
    const data = { type: "product-buy", containers: pl };
    return {
        urlPath: `/ajax-state/product-buy/`,
        host: WEB_HOST,
        method: "POST",
        headers: [
            "Content-Type: application/x-www-form-urlencoded",
            "accept: */*",
            `x-requested-with: XMLHttpRequest`,
        ],
        remoteCategoryId: "",
        raw: `data=${JSON.stringify(data)}`,
        page: -1,
    };
};
export const imageRequestOpts = (imageIds) => {
    return {
        urlPath: `/catalog/product/get-images/`,
        host: WEB_HOST,
        method: "POST",
        headers: [
            "Content-Type: application/x-www-form-urlencoded",
            "accept: */*",
            `x-requested-with: XMLHttpRequest`,
        ],
        remoteCategoryId: "",
        raw: `ids=${JSON.stringify(imageIds)}`,
        page: -1,
    };
};
