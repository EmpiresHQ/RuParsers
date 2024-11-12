import { BaseProcessorError } from "../../types/error.js";
import { CategoryParser } from "../../types/index.js";
import { DNSItem, Item } from "./types.js";

const _itemMapper = ({
  data: {
    id,
    name,
    price: { current },
  },
  images,
}: DNSItem): Item => ({
  skuId: id,
  title: name,
  regularPrice: ((current || 0) * 100).toString(),
  imageUrl: images && images[0],
  isAvailable: true,
});

export const apiParser: CategoryParser<
  DNSItem[] | { error: string } 
> = async ({ json }) => {
  if (!json || "error" in json) {
    if (json?.error && ["notfound", "notparsed", "noproducts"].includes(json.error)) {
      return {
        items: [],
        hasNextPage: false
      }
    }
    return {
      err: BaseProcessorError.Crawler,
    };
  }
  const items = json.filter(i => i.data.price && i.data.price.current).map<Item>(_itemMapper);
  const hasNextPage = items.length > 0;
  return {
    items,
    hasNextPage,
  };
};
