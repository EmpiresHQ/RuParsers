import { BaseItem } from "./item.js";
import { InitialSettings, SettingsHandler } from "./settings.js";

export * from "./item.js";
export * from "./settings.js";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CategoryParser<T = any> = (
  html: Buffer | T
) => Promise<{ items: BaseItem[] | undefined; hasNextPage: boolean }>;

export type StrategyHandler = { parser: CategoryParser; opts: SettingsHandler, settings?: InitialSettings };
