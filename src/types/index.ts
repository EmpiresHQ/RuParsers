import { BaseItem } from "./item.js";
import { InitialSettings, SettingsHandler } from "./settings.js";

export * from "./item.js";
export * from "./settings.js";
export * from "./base.js";

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type CategoryParser<T extends Object = any> = (args: {
  html?: Buffer;
  json?: T;
}) => Promise<{
  items: BaseItem[] | undefined;
  hasNextPage: boolean;
  err?: unknown;
}>;

export type StrategyHandler = {
  parser: CategoryParser;
  opts: SettingsHandler;
  settings: InitialSettings;
};
