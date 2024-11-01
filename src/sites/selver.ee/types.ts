import { BaseCategory, BaseItem, ProxyType } from "../../types/index.js";

export interface Item extends BaseItem {}
type Price = {
  price: number; // euros
  original_price: number; // euros
  is_discount: boolean;
  customer_group_id: number; // number-number
  tax_class_id: number;
  final_price: number;
  min_price: number;
  max_price: number;
};

type ProductCategory = {
  category_id: number;
  is_virtual: boolean;
  position: number;
  name: string;
};

type ProductMedia = {
  typ: "image" | "video";
  image: string;
  lab: string;
  pos: number;
};

type ProductEan = {
  ean: string;
  ean_trimmed: string;
};

type ProductStock = {
  product_id: number;
  item_id: number;
  stock_id: number;
  qty: number;
  is_in_stock: boolean;
  is_qty_decimal: boolean;
  use_config_min_qty: boolean;
  min_qty: number;
  use_config_min_sale_qty: boolean;
  min_sale_qty: number;
  use_config_max_sale_qty: boolean;
  max_sale_qty: number;
  use_config_notify_stock_qty: boolean;
  notify_stock_qty: number;
  use_config_qty_increments: boolean;
  backorders: boolean;
  use_config_backorders: boolean;
  qty_increments: number;
  use_config_enable_qty_inc: boolean;
  enable_qty_increments: boolean;
  use_config_manage_stock: boolean;
  manage_stock: boolean;
  low_stock_date: null;
  stock_status: number;
};
export type Product = {
  entity_id: string;
  attribute_set_id: string;
  type_id: "simple";
  sku: string;
  has_options: boolean;
  required_options: boolean;
  row_id: string;
  created_in: string;
  updated_in: string;
  visibility: number;
  prices: Price[];
  indexed_attributes: string[];
  category: ProductCategory[];
  category_ids: number[];
  id: string;
  status: number;
  tax_class_id: number;
  product_manufacturer: number;
  product_brand: number;
  product_country_of_origin: number;
  product_segment: number;
  product_age_restricted: boolean;
  product_replaceble: boolean;
  product_disable_discount_show: boolean;
  product_sales_unit: number;
  product_order_method: number;
  product_compare_unit: number;
  product_nutr_unit: number;
  product_quality_class: number;
  free_shipping: boolean;
  name: string;
  image: string;
  small_image: string;
  thumbnail: string;
  url_key: string;
  product_main_ean: string;
  product_other_ean: string;
  pim_attribute_set: string;
  product_net_volume: null;
  product_volume: string;
  eshop_category: number[];
  product_dietary_info: string[];
  product_weight_step: string;
  product_unit_net: null;
  product_compare_unit_factor: string;
  product_main_ecategory: number[];
  product_stocktype: "STOCK";
  product_stocksource: unknown;
  description: string;
  price: number;
  special_price: number;
  unit_price: number;
  slug: string;
  url_path: string;
  stock: ProductStock;
  final_price: number;
  regular_price: number;
  tier_prices: [];
  media_gallery: ProductMedia[];
  is_new_flag: boolean;
  ean_data: ProductEan[];
  original_price: number;
  original_price_tax: number;
  original_price_incl_tax: number;
  original_final_price: number;
  price_tax: number;
  price_incl_tax: number;
  final_price_tax: number;
  final_price_incl_tax: number;
  special_price_tax: number;
  special_price_incl_tax: number;
};

export type ProductContainer = {
  _index: "vue_storefront_catalog_et_product_number_number";
  _type: "_doc";
  _id: "number";
  _score: null;
  _source: Product;
};

export type TreeParser = (args: {
  proxy: ProxyType;
}) => Promise<BaseCategory[]>;

export type CategoryContainer = {
  _index: "vue_storefront_catalog_et_category_20241101_043848";
  _type: "_doc";
  _id: "427";
  _score: null;
  _source: Category;
};

export type Category = {
  parent_id: number;
  path: string;
  position: number;
  level: number;
  children_count: number;
  is_active: boolean;
  name: string;
  display_mode: "PRODUCTS" | "other";
  url_key: string;
  url_path: string
  include_in_menu: number;
  is_virtual_category: boolean;
  virtual_category_root: number;
  is_exclude_cat: boolean;
  sync_to_facebook_catalog: boolean;
  id: number;
  slug: string;
  product_count: number;
  children_data: Category[];
};
