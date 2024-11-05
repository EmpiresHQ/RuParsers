export const cookieToString = (cookies) => (cookies !== null && cookies !== void 0 ? cookies : []).map((c) => `${c.name}=${c.value}`).join(";");
