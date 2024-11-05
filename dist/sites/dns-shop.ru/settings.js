export const API_HOST = "https://restapi.dns-shop.ru/v1";
export const WEB_HOST = "https://dns-shop.ru";
export const loaderSettings = {
    antibotOpts: {
        url: `${WEB_HOST}`,
        waitAfterLoad: 4000,
        fetchCookies: {
            domains: ["https://dns-shop.ru"],
            cookieNames: ["qrator_jsid", "qrator_ssid", "qrator_jsr"],
        },
    },
    perPage: -1,
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
