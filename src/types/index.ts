import { BaseProcessorError } from "./error.js";
import { BaseItem } from "./item.js";
import { InitialSettings, RequestParameters, SettingsHandler } from "./settings.js";

export * from "./item.js";
export * from "./settings.js";
export * from "./base.js";
export * from "./category.js";

export type ParserResponseType<T extends Object = any> = {
  html?: Buffer;
  json?: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type CategoryParser<T extends Object = any> = (args: ParserResponseType<T>) => Promise<{
  items?: BaseItem[];
  hasNextPage?: boolean;
  err?: BaseProcessorError;
}>;

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type StrategyHandler<T extends Object = any> = {
  parser: CategoryParser;
  opts: SettingsHandler<T>;
  settings: InitialSettings;
  fetcher?: <T extends Object = any>(params: RequestParameters) => ParserResponseType<T>
};
