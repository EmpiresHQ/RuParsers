import { BaseClass } from "./base/index.js";
import {
  selver_ee,
  barbora_ee,
  lemanapro_ru,
  vseinstrumenti_ru,
  dns_shop_ru,
  ozon_ru,
} from "./sites/index.js";
import {
  AvailablePlatforms,
  CookieLoader,
  Fetcher,
  StrategyHandler,
} from "./types/index.js";

export * from "./lib/index.js";
export * from "./sites/index.js";

export const availablePlatforms: {
  [key in AvailablePlatforms]: {
    strategies: { [strategy in string]: StrategyHandler };
    preferredStrategy: "api" | "js";
  };
} = {
  "vseinstrumenti.ru": {
    strategies: vseinstrumenti_ru.strategies,
    preferredStrategy: vseinstrumenti_ru.preferredStrategy,
  },
  "lemanapro.ru": {
    strategies: lemanapro_ru.strategies,
    preferredStrategy: lemanapro_ru.preferredStrategy,
  },
  "barbora.ee": {
    strategies: barbora_ee.strategies,
    preferredStrategy: barbora_ee.preferredStrategy,
  },
  "selver.ee": {
    strategies: selver_ee.strategies,
    preferredStrategy: selver_ee.preferredStrategy,
  },
  "dns-shop.ru": {
    strategies: dns_shop_ru.strategies,
    preferredStrategy: dns_shop_ru.preferredStrategy,
  },
};

export const AvailablePlatformsv2 = (
  platform: AvailablePlatforms,
  {
    fetcher,
    cookieLoader,
  }: {
    fetcher: Fetcher<unknown>;
    cookieLoader: CookieLoader;
  }
) => {
  const platforms: Record<string, {
    categoryLoader: BaseClass
  }> = {
    ["ozon.ru"]: {
      categoryLoader: new ozon_ru.OzonCategoryProcessor({
        fetcher: fetcher as Fetcher<ozon_ru.CategoryResponseData>,
        cookieLoader,
      }),
    },
    ["lemanapro.ru"]: {
      categoryLoader: new lemanapro_ru.CategoryProcessor({
        fetcher: fetcher as Fetcher<lemanapro_ru.Page>,
        cookieLoader,
      }),
    },
    ["vseinstrumenti.ru"]: {
      categoryLoader: new vseinstrumenti_ru.CategoryProcessor({
        fetcher: fetcher as Fetcher<vseinstrumenti_ru.Page>,
        cookieLoader,
      }),
    },
  };
  if (platform in platforms) {
    return platforms[platform];
  }
};
