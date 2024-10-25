import { BaseProcessorError } from "./error.js";
import { BaseItem } from "./item.js";
import { InitialSettings, SettingsHandler } from "./settings.js";
export * from "./item.js";
export * from "./settings.js";
export * from "./base.js";
export * from "./category.js";
export type CategoryParser<T extends Object = any> = (args: {
    html?: Buffer;
    json?: T;
}) => Promise<{
    items?: BaseItem[];
    hasNextPage?: boolean;
    err?: BaseProcessorError;
}>;
export type StrategyHandler<T extends Object = any> = {
    parser: CategoryParser;
    opts: SettingsHandler<T>;
    settings: InitialSettings;
};
//# sourceMappingURL=index.d.ts.map