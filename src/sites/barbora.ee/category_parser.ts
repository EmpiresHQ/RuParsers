import * as cheerio from "cheerio";
import * as vm from "node:vm";
import { CategoryParser } from "../../types/index.js";
import { BarboraItem, Item, WindowCTX } from "./index.js";

// https://production-elb.barbora.lt/api/cache/v1/country/EE/categories
const _itemMapper = (item: BarboraItem): Item => ({
  title: item.title,
  skuId: item.Url,
  imageUrl: item.big_image,
  isAvailable: item.status === 'active',
  regularPrice: (item.price * 100).toString(),
  units: item.units,
});
export const jsParser: CategoryParser = async ({ html }) => {
  if (!Buffer.isBuffer(html)) {
    throw new Error("not a buffer");
  }
  const $ = cheerio.load(html);
  const src = $("script").filter(
    (_, ele) =>
      ($(ele).html() ?? "").substring(0, 100).indexOf("b_productList") > -1
  );
  const ctx: WindowCTX = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src.html() ?? "undefined", ctx);
  const products = ctx.window.b_productList ?? [];

  const items = products.map<Item>(_itemMapper);
  const hasNextPage = items.length > 0;
  return {
    items,
    hasNextPage
  };
};
