import { ParserResponseType } from "../../types/index.js";
import { ProxyType, RequestParameters } from "../../types/settings.js";
import { Client } from "@opensearch-project/opensearch";
import { ProductContainer } from "./types.js";
export declare const fetcher: (requestParams: RequestParameters) => Promise<ParserResponseType<ProductContainer[] | {
    error: unknown;
}>>;
export declare const openSearchClient: ({ idx, proxyParam, }: {
    idx?: string;
    proxyParam?: ProxyType;
}) => {
    client: Client;
    node: string;
};
//# sourceMappingURL=fetcher.d.ts.map