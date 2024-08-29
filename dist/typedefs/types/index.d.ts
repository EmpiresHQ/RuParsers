import { BaseItem } from "./item.js";
import { InitialSettings, SettingsHandler } from "./settings.js";
export * from "./item.js";
export * from "./settings.js";
export type CategoryParser<T = any> = (html: Buffer | T) => Promise<{
    items: BaseItem[] | undefined;
    hasNextPage: boolean;
}>;
export type StrategyHandler = {
    parser: CategoryParser;
    opts: SettingsHandler;
    settings?: InitialSettings;
};
//# sourceMappingURL=index.d.ts.map