import { BaseItem } from "../../types/index.js";

export enum WbError {
  Crawler = "1",
  Timeout = "2",
  NotFound = "3",
}

export interface WbCardItem {
  time1: number;
  time2: number;
  wh: number;
  dtype: number;
  id: number;
  root: number;
  kindId: number;
  brand: string;
  brandId: number;
  siteBrandId: number;
  colors: WbColor[];
  subjectId: number;
  subjectParentId: number;
  name: string;
  supplier: string;
  supplierId: number;
  supplierRating: number; // float
  supplierFlags: number;
  pics: number;
  rating: number;
  reviewRating: number;
  feedbacks: number;
  volume: number;
  viewFlags: number;
  sizes: WbSize[];
  log: object;
}

export interface WbCardItemPrice {
  basic: number;
  product: number;
  total: number;
  logistics: number;
  return: number;
}

export interface WbItem {
  __sort: number;
  ksort: number;
  time1: number;
  time2: number;
  wh: number;
  dtype: number;
  dist: number;
  id: number;
  root: number;
  kindId: number;
  brand: string;
  brandId: number;
  siteBrandId: number;
  colors: WbColor[];
  subjectId: number;
  subjectParentId: number;
  name: string;
  supplier: string;
  supplierId: number;
  supplierRating: number; // float
  supplierFlags: number;
  priceU: number;
  salePriceU: number;
  sale: number;
  logisticsCost: number;
  returnCost: number;
  diffPrice: boolean;
  saleConditions: number;
  pics: number;
  rating: number;
  reviewRating: number;
  feedbacks: number;
  volume: number;
  viewFlags: number;
  sizes: WbSize[];
  log: object;
}

export interface ResponseWbCategory {
  state: number;
  version: number;
  params: {
    version: number;
    curr: "rub";
    spp: number;
    payloadVersion: number;
  };
  data: {
    products?: WbItem[];
    total: number;
  };
}

export interface ResponseWbItem {
  state: number;
  payloadVersion: number;
  data: {
    products?: WbCardItem[];
  };
}

type WbColor = {
  name: string;
  id: number;
};

type WbSize = {
  name: string;
  origName: string;
  rank: string;
  optionId: number;
  wh: number;
  dtype: number;
  stocks?: unknown[]; // TODO
  returnCost: number;
  sign: string;
  payload: string;
  price?: WbCardItemPrice;
};
export interface WbResponseItem extends BaseItem {}

export interface WbCategory {
  title: string;
  id?: string | number;
  url: string;
  parent_id?: string | number;
  meta: {
    query?: string;
    shard: string;
  };
}
