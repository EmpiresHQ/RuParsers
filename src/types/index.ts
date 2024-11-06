import { BaseProcessorError } from "./error.js";
import { BaseItem } from "./item.js";
import {
  BaseRequestParameters,
  InitialSettings,
  RequestParameters,
  SettingsHandler,
} from "./settings.js";

export * from "./item.js";
export * from "./settings.js";
export * from "./base.js";
export * from "./category.js";

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type ParserResponseType<T extends Object = any> = {
  html?: Buffer;
  json?: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type CategoryParser<T extends Object = any> = (
  args: ParserResponseType<T>
) => Promise<{
  items?: BaseItem[];
  hasNextPage?: boolean;
  err?: BaseProcessorError;
}>;

export type StrategyHandler<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  T extends Object = any,
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  C extends Object = any,
> = {
  parser: CategoryParser;
  opts: SettingsHandler<T>;
  settings: InitialSettings;
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  fetcher?: (
    params: RequestParameters,
    loader?: (opts: BaseRequestParameters) => unknown
  ) => Promise<C>;
};
