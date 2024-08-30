import { BaseItem, BaseRequestParameters } from "../../types/index.js";

export interface Item extends BaseItem {}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type TreeParser = (args: {
  rootLoader: (args: BaseRequestParameters) => Promise<CategoryRootPayload>;
  leafLoader: (args: BaseRequestParameters) => Promise<CategoryLeafPayload[]>;
  childLoader: (args: BaseRequestParameters) => Promise<CategoryChildren[]>;
}) => Promise<void>
  

export type CategoryRootPayload = {
  data: CategoryRootItem[];
};

export type CategoryRootItem = {
  count: number;
  groupId: number;
  id: string;
  name: string;
};

export type CategoryLeafPayload = {
  children: CategoryLeafChildren[];
  id: string; // range
  name: string;
  url: string;
};

type CategoryLeafChildren = {
  count: number;
  id: number;
  isForceShow: boolean;
  isSubcategoriesExist: boolean;
  leftBorder: number;
  name: string;
  rightBorder: number;
  url: string;
};

export type CategoryChildren = {
  count: number;
  id: number;
  name: string;
  url: string;
};

export type ApiPayload = {
  listingType: string;
  id: number;
  page: {
    number: number;
    perPage: number;
  };
};

export type NuxtProduct = {
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

export type Listing = {
  perPage: number;
  pageNumber: number;
  productsForPaginationCount: number;
  products: {
    [key in string]: NuxtProduct;
  };
};

export type WindowNUXT = {
  window: {
    __NUXT__?: {
      state: {
        listing: Listing;
      };
    };
  };
};

export interface Page {
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
}
