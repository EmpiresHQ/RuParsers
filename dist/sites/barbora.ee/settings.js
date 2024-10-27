export const HOST = "https://barbora.ee";
export const restRequestOpts = (handler, page = 0) => {
    var _a;
    return ({
        urlPath: page > 1
            ? `/${handler.data.text}?page=${page}`
            : `/${handler.data.text}/`,
        method: "GET",
        host: HOST,
        remoteCategoryId: (_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : "1",
        page,
    });
};
export const REST_SETTINGS = {
    perPage: 100,
};
