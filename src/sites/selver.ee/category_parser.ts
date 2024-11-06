import { BaseProcessorError } from "../../types/error.js";
import { CategoryParser } from "../../types/index.js";
import { MEDIA_HOST } from "./settings.js";
import { Item, ProductContainer } from "./types.js";

export const apiParser: CategoryParser<ProductContainer[] | { error: unknown }> = async ({ json }) => {
  if (!json) {
    return {
      err: BaseProcessorError.Crawler
    }
  }
  if (Buffer.isBuffer(json)) {
    throw new Error("is a buffer");
  }
  if ('error' in json) {
    throw new Error(JSON.stringify(json.error))
  }
  const items = json.map<Item>( ({_source: item}) => ({
    skuId: item.url_path,
    title: item.name,
    regularPrice: (item.final_price_incl_tax * 100).toString(),
    imageUrl: `${MEDIA_HOST}${item.image}`,
    isAvailable: item.stock.is_in_stock
  }))
  return {
    items,
    hasNextPage: !!items && items.length > 0
  }
};
