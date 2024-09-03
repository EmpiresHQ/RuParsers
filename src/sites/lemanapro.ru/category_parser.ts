import { CategoryParser } from "../../types/index.js";
import { Item, LemanaItem, Page } from "./index.js";

const _itemMapper = ({
  productId,
  displayedName,
  price: { main_price },
  mediaMainPhoto: { desktop },
  eligibility,
}: LemanaItem): Item => ({
  skuId: productId,
  title: displayedName,
  regularPrice: ((main_price || 0) * 100).toString(),
  imageUrl: desktop,
  isAvailable: !!(
    eligibility &&
    (eligibility.homeDeliveryEligible ||
      eligibility.relayPointEligible ||
      eligibility.storeDeliveryEligible ||
      eligibility.webEligible)
  ),
});

export const apiParser: CategoryParser<Page> = async ({ json }) => {
  if (!json) {
    throw new Error("data should not be buffer");
  }
  const items = json.content.map<Item>(_itemMapper);
  const hasNextPage = items.length > 0;
  return {
    items,
    hasNextPage,
  };
};
