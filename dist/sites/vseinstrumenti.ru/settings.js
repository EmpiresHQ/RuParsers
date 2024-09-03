export const HOST = "https://www.vseinstrumenti.ru";
export const API_HOST = "https://bff.vseinstrumenti.ru";
export const CDN_HOST = "https://cdn.vseinstrumenti.ru";
export const restRequestOpts = (handler, page = 0) => {
    var _a;
    return ({
        urlPath: page > 1
            ? `/category/${handler.data.text}/page${page}/`
            : `/category/${handler.data.text}/`,
        method: "GET",
        host: HOST,
        remoteCategoryId: (_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : "1",
        page,
    });
};
export const REST_SETTINGS = {
    antibotOpts: {
        url: HOST,
        fetchCookies: {
            domains: ["https://vseinstrumenti.ru"],
            cookieNames: ["acctoken", "cf_clearance"],
        },
        waitUrl: "challenge-platform",
        waitAfterLoad: 5000,
    },
    perPage: 40,
};
export const API_SETTINGS = {
    antibotOpts: {
        url: HOST,
        fetchCookies: {
            domains: ["https://vseinstrumenti.ru"],
            cookieNames: ["acctoken", "cf_clearance"],
        },
        // waitUrl: "challenge-platform",
        waitAfterLoad: 3000,
    },
    perPage: 40,
};
export const treeRootOpts = () => ({
    urlPath: `/api/catalog/topics`,
    host: API_HOST,
    method: "GET",
    headers: ["Content-Type: application/json"],
});
export const treeLeafOpts = ({ remoteCategoryId, }) => ({
    urlPath: `/api/catalog/categories?id=${remoteCategoryId}&activeRegionId=-1`,
    host: API_HOST,
    method: "GET",
    headers: ["Content-Type: application/json"],
});
export const treeChildOpts = ({ left, right, }) => ({
    urlPath: `/api/catalog/child-categories?leftBorder=${left}&rightBorder=${right}&activeRegionId=-1`,
    host: API_HOST,
    method: "GET",
    headers: ["Content-Type: application/json"],
});
export const apiRequestOpts = (handler, page = 0) => {
    var _a, _b, _c, _d, _e, _f;
    return ({
        urlPath: `/api/category/load?short=true`,
        host: API_HOST,
        method: "POST",
        headers: [
            "Content-Type: application/json",
            ...(((_b = (_a = handler.data.meta) === null || _a === void 0 ? void 0 : _a.antibotData) === null || _b === void 0 ? void 0 : _b.cookies)
                ? [
                    `Token: ${(_e = ((_d = (_c = handler.data.meta) === null || _c === void 0 ? void 0 : _c.antibotData.cookies) !== null && _d !== void 0 ? _d : []).find((c) => c.name == `acctoken`)) === null || _e === void 0 ? void 0 : _e.value}`,
                ]
                : []),
        ],
        remoteCategoryId: (_f = handler.data.remoteId) !== null && _f !== void 0 ? _f : "",
        page,
        payload: {
            listingType: "category",
            id: +handler.data.remoteId,
            page: {
                number: page,
                perPage: API_SETTINGS.perPage,
            },
        },
    });
};
export const requiredCookies = ["acctoken", "cf_clearance"];
export const requiredHeaders = ["Token"];
