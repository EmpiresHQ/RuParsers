import { BaseProcessorError } from "../../types/error.js";
import { CategoryParser } from "../../types/index.js";
import { DNSItem, Item } from "./types.js";

const _itemMapper = ({
  data: { id, name, price, notAvail },
  images,
}: DNSItem): Item => ({
  ...{
    skuId: id,
    title: name,
    imageUrl: images && images[0],
    isAvailable: true,
  },
  ...(price
    ? { regularPrice: ((price.current || 0) * 100).toString() }
    : { regularPrice: "0" }),
  ...(notAvail ? { isAvailable: false } : {}),
});

export const apiParser: CategoryParser<DNSItem[] | { error: string }> = async ({
  json,
}) => {
  if (!json || "error" in json) {
    if (
      json?.error &&
      ["notfound", "notparsed", "noproducts"].includes(json.error)
    ) {
      return {
        items: [],
        hasNextPage: false,
      };
    }
    if (json?.error === BaseProcessorError.NotFound) {
      return { err: json.error };
    }
    return {
      err: BaseProcessorError.Crawler,
    };
  }
  const items = json
    .filter((i) => i.data.price && i.data.price.current)
    .map<Item>(_itemMapper);
  const hasNextPage = items.length > 0;
  return {
    items,
    hasNextPage,
  };
};
