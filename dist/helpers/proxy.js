export const proxyUrl = (proxy) => {
    var _a;
    const [user, pass] = ((_a = proxy.auth) !== null && _a !== void 0 ? _a : "").split(":");
    const url = new URL(proxy.url);
    if (user && pass) {
        url.username = user;
        url.password = pass;
    }
    return url.toString();
};
