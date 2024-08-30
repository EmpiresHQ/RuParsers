import * as cheerio from "cheerio";
import { title } from "process";
import { digitMatcher, pagesParser } from "../../lib/index.js";
import * as vm from "node:vm";
import { CategoryParser } from "../../types/index.js";
import { CDN_HOST } from "./settings.js";
import { Item, NuxtProduct, Page, WindowNUXT } from "./index.js";

export const htmlParser: CategoryParser = async ({html}) => {
  if (!Buffer.isBuffer(html)) {
    throw new Error("not a buffer");
  }
  const $ = cheerio.load(html);
  const currentPage = $(".pagination-container>a.-active").html()?.trim();
  const lastPage = $(".pagination-container>a:last-of-type").html()?.trim();
  const data = $.extract({
    items: [
      {
        selector: '[data-qa="products-tile"]',
        value: {
          sku: {
            selector: '[data-qa="product-code-text"]',
            value: (el) => digitMatcher($(el).text().trim()),
          },
          regularPrice: {
            selector: '[data-qa="product-price-current"]',
            value: (el) => $(el).text().trim(),
          },
          discountPrice: {
            selector: '[data-qa="product-personal-price"]',
            value: (el) => $(el).text().trim(),
          },
          title: {
            selector: '[data-qa="product-name"]>span',
            value: (el) => $(el).text().trim(),
          },
          stock: {
            selector: '[data-qa="product-availability-total-available"]',
            value: (el) => {
              const stock = digitMatcher(
                $(el).text().trim().replace(/\n/g, "")
              );
              if (stock) {
                return stock === "100" ? Infinity : +stock;
              }
            },
          },
          imageUrl: {
            selector: '[data-qa="product-photo-click"] img',
            value: (el) => {
              return $(el).data("url") as string;
            },
          },
        },
      },
    ],
  });

  const items = data.items.map<Item>(
    ({ sku, regularPrice, discountPrice, stock, imageUrl }) => ({
      discountPrice,
      stock,
      imageUrl,
      skuId: sku ?? "",
      regularPrice: regularPrice ?? "",
      title: title ?? "",
      isAvailable: !!stock,
    })
  );
  return {
    items,
    hasNextPage: currentPage && lastPage ? currentPage < lastPage : false,
  };
};


const _itemMapper = (item: NuxtProduct): Item => {
  const { code, pricesV2, name, availabilityInfo, image } = item;
  return {
    title: name,
    skuId: code,
    stock: availabilityInfo.currentlyAvailable,
    imageUrl: `${CDN_HOST}${image}`,
    regularPrice: pricesV2.current.toString(),
    discountPrice: pricesV2.availableDiscountPrices
      .sort((a, b) => a.price - b.price)
      ?.shift()
      ?.price.toString(),
  };
};
export const jsParser: CategoryParser = async ({html}) => {
  if (!Buffer.isBuffer(html)) {
    throw new Error("not a buffer");
  }
  const $ = cheerio.load(html);
  const src = $("script").filter(
    (_, ele) => ($(ele).html() ?? "").substring(0, 100).indexOf("NUXT") > -1
  );
  const ctx: WindowNUXT = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src.html() ?? "undefined", ctx);
  const state = ctx.window.__NUXT__?.state;
  const products = state?.listing.products ?? {};
  const items = Object.values(products).map<Item>(_itemMapper);
  const { hasNextPage } = pagesParser({
    pageNumber: state?.listing.pageNumber ?? 0,
    totalProducts: state?.listing.productsForPaginationCount ?? 0,
    perPage: state?.listing.perPage ?? 40,
  });
  return {
    items,
    hasNextPage,
  };
};

export const apiParser: CategoryParser<Page> = async ({json}) => {
  if (!json) {
    throw new Error("data should not be buffer");
  }
  const items = json.products.map<Item>(_itemMapper);
  const hasNextPage =
    json.listingSettings.pages.current < json.listingSettings.pages.max;
  return {
    items,
    hasNextPage,
  };
};
