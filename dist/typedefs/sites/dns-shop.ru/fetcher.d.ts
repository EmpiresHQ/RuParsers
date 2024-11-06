import { BaseRequestParameters, RequestParameters } from "../../types/index.js";
import { DNSItem } from "./types.js";
export declare const fetcher: (requestParams: RequestParameters, loader?: (opts: BaseRequestParameters) => unknown) => Promise<DNSItem[] | {
    error: string;
}>;
//# sourceMappingURL=fetcher.d.ts.map