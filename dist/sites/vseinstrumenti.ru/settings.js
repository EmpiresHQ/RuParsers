export const HOST = "https://www.vseinstrumenti.ru";
export const API_HOST = "https://bff.vseinstrumenti.ru";
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
    }
};
export const apiRequestOpts = (handler, page = 0) => {
    var _a;
    return ({
        urlPath: `/api/category/load?short=true`,
        host: API_HOST,
        method: "GET",
        remoteCategoryId: (_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : 1,
        page,
        payload: {
            listingType: 'category',
            id: handler.data.remoteId,
            page: {
                number: page,
                perPage: 40
            }
        }
    });
};
export const requiredCookies = ["acctoken", "cf_clearance"];
export const requiredHeaders = ["Token"];
