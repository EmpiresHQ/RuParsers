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
        remoteCategoryId: (_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : 1,
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
        url: API_HOST,
        fetchCookies: {
            domains: ["https://vseinstrumenti.ru"],
            cookieNames: ["acctoken", "cf_clearance"],
        },
        waitUrl: "challenge-platform",
        waitAfterLoad: 5000,
    },
    perPage: 40,
};
export const apiRequestOpts = (handler, page = 0) => {
    var _a, _b, _c, _d;
    return ({
        urlPath: `/api/category/load?short=true`,
        host: API_HOST,
        method: "POST",
        headers: [
            "Content-Type: application/json",
            ...(((_a = handler.data.meta) === null || _a === void 0 ? void 0 : _a.cookies)
                ? [
                    `Token: ${(_c = (_b = handler.data.meta) === null || _b === void 0 ? void 0 : _b.cookies.find((c) => c.name == `acctoken`)) === null || _c === void 0 ? void 0 : _c.value}`,
                ]
                : []),
        ],
        remoteCategoryId: (_d = handler.data.remoteId) !== null && _d !== void 0 ? _d : 1,
        page,
        payload: {
            listingType: "category",
            id: _idFromUrl(handler.data.text),
            page: {
                number: page,
                perPage: API_SETTINGS.perPage,
            },
        },
    });
};
const _idFromUrl = (text) => { var _a; return +((_a = text.split("-").pop()) !== null && _a !== void 0 ? _a : -1); };
export const requiredCookies = ["acctoken", "cf_clearance"];
export const requiredHeaders = ["Token"];
