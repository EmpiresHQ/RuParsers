import { ProxyType } from "../types/settings.js";

export const proxyUrl = (proxy : ProxyType): string => {
  const [user, pass] = (proxy.auth ?? "").split(":");
  const url = new URL(proxy.url);
  if (user && pass) {
    url.username = user;
    url.password = pass;
  }
  return url.toString();
};
