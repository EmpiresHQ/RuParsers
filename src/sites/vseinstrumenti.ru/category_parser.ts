import * as cheerio from "cheerio";
import { BaseItem } from "../../types/item.js";
import { title } from "process";
import { digitMatcher, pagesParser } from "../../lib/index.js";
import * as vm from "node:vm";
import { CategoryParser } from "../../types/index.js";

interface Item extends BaseItem {}

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

type NuxtProduct = {
  USP: string;
  adminInfo: {
    canOutOstMainStore?: boolean;
  };
  availabilityInfo: {
    countInStock: number;
    courierPickupDate: string;
    currentlyAvailable: number;
    hasFreeDelivery: boolean;
    inWarehouse: number;
    isForPickupOnly: boolean;
    isInStock: boolean;
    isOnStockInCourierOffice: boolean;
    officePickupMessage: string;
    officePickupName: string;
    selfPickupDate: string;
  };
  banDeliveryId: number;
  canSubscribeAtAvailability: boolean;
  characteristics: {
    name: string;
    unit: string;
    value: string;
  }[];
  code: string; // sku
  dimensions?: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  discountPercent: number;
  discountPrice: number;
  discountPricePercent: number;
  has3d: boolean;
  hasAnalogs: boolean;
  hasCourier: boolean;
  hasVideos: boolean;
  id: number; // internal id
  image: string;
  images: string[];
  isAvailable: boolean;
  isConsumable: boolean;
  isLastPrice: boolean;
  link: string;
  makeId: number; // brand
  name: string;
  // nameplates: [[Object]];
  note: string;
  pricesV2: {
    availableDiscountPrices: {
      price: number;
      type: string;
    }[];
    current: number;
  };
  responses: {
    amount: number;
    averageRatio: number; // stars
    link: string;
  };
};

type Listing = {
  perPage: number;
  pageNumber: number;
  productsForPaginationCount: number;
  products: {
    [key in string]: NuxtProduct;
  };
};

type WindowNUXT = {
  window: {
    __NUXT__?: {
      state: {
        listing: Listing;
      };
    };
  };
};

interface Page {
  listingSettings: {
    limit: number;
    pages: {
      current: number;
      max: number;
    };
  };
  products: NuxtProduct[];
  productsCount: number;
  productsForPaginationCount: number;
};

const _itemMapper = (item: NuxtProduct): Item => {
  const { code, pricesV2, name, availabilityInfo, image } = item;
  return {
    title: name,
    skuId: code,
    stock: availabilityInfo.currentlyAvailable,
    imageUrl: image,
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
