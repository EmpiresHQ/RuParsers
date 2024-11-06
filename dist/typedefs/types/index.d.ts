import { BaseProcessorError } from "./error.js";
import { BaseItem } from "./item.js";
import { BaseRequestParameters, InitialSettings, RequestParameters, SettingsHandler } from "./settings.js";
export * from "./item.js";
export * from "./settings.js";
export * from "./base.js";
export * from "./category.js";
export type ParserResponseType<T extends Object = any> = {
    html?: Buffer;
    json?: T;
};
export type CategoryParser<T extends Object = any> = (args: ParserResponseType<T>) => Promise<{
    items?: BaseItem[];
    hasNextPage?: boolean;
    err?: BaseProcessorError;
}>;
export type StrategyHandler<T extends Object = any, C extends Object = any> = {
    parser: CategoryParser;
    opts: SettingsHandler<T>;
    settings: InitialSettings;
    fetcher?: (params: RequestParameters, loader?: (opts: BaseRequestParameters) => unknown) => Promise<C>;
};
//# sourceMappingURL=index.d.ts.map