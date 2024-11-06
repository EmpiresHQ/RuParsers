import { Client } from "@opensearch-project/opensearch";
import { HandlerParams, ParserResponse } from "../../types/index.js";
type ContextMap = {
    search: Client;
};
export declare const ctxLoader: (args?: any) => Promise<ContextMap | undefined>;
export declare const handler: ({ ctx, handler: requestHandler, page, }: HandlerParams<ContextMap>) => Promise<ParserResponse>;
export {};
//# sourceMappingURL=handler.d.ts.map