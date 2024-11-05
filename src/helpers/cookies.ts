import { SimpleCookie } from "../types/base.js";

export const cookieToString = (cookies: SimpleCookie[]): string => (cookies ?? []).map((c) => `${c.name}=${c.value}`).join(";");