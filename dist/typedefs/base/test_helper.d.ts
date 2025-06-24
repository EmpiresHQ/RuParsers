import { ProcessBodyParams } from "../helpers/renderer.js";
import { Fetcher, ProxyType } from "../types/index.js";
export declare const proxy: ProxyType;
export declare const ozonProxy: ProxyType;
export declare const cookieLoader: (opts?: Partial<ProcessBodyParams>) => Promise<{
    cookies: {
        name: string;
        value: string;
    }[];
}>;
export declare const loader: Fetcher;
//# sourceMappingURL=test_helper.d.ts.map