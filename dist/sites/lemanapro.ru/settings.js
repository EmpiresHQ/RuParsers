const API_HOST = "https://api.lemanapro.ru";
const HOST = "https://lemanapro.ru";
export const API_SETTINGS = {
    antibotOpts: {
        url: HOST,
        waitAfterLoad: 4000,
        // evaluateRuntime: "window.INITIAL_STATE['plp']['plp']",
        // waitForElement: "#init",
        fetchCookies: {
            domains: ["https://lemanapro.ru"],
            cookieNames: ["qrator_jsid2", "_ym_uid", "qrator_jsr", "_regionID"],
        },
    },
    perPage: 40,
};
export const treeRootSettings = {
    antibotOpts: {
        url: `${HOST}/catalogue`,
        waitAfterLoad: 4000,
        evaluateRuntime: "window.INITIAL_STATE"
    },
    perPage: -1
};
export const apiRequestOpts = (handler, page = 0) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const token = ((_b = (_a = handler.data.meta) === null || _a === void 0 ? void 0 : _a.antibotData) === null || _b === void 0 ? void 0 : _b.evaluatedValue) ?
        ((_d = (_c = handler.data.meta) === null || _c === void 0 ? void 0 : _c.antibotData) === null || _d === void 0 ? void 0 : _d.evaluatedValue).env.apiKey : "Yeg8l3zQDwpVNBDTP3q6jM4lQVLW5TTv";
    return {
        urlPath: `/hybrid/v1/getProducts?lang=ru`,
        host: API_HOST,
        method: "POST",
        headers: [
            "Content-Type: application/json",
            `x-api-key: ${token}`
        ],
        remoteCategoryId: (_e = handler.data.remoteId) !== null && _e !== void 0 ? _e : "",
        page,
        payload: {
            familyIds: [(_g = (_f = handler.data.meta) === null || _f === void 0 ? void 0 : _f.key) !== null && _g !== void 0 ? _g : ""],
            regionId: "34",
            suggest: true,
            limit: 30,
            offset: page * 30
        },
    };
};
