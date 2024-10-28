import { BaseCategory, BaseItem } from "../../types/index.js";
export type WindowCTX = {
    window: {
        b_productList?: BarboraItem[];
    };
};
export interface Item extends BaseItem {
    units: Unit[];
}
type UnitType = "tk" | "kg";
type Unit = {
    id: number;
    price: number;
    unit: UnitType;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
};
export type BarboraItem = {
    attributes: {
        list: [];
    };
    picking_actions: [];
    units: Unit[];
    is_adult: boolean;
    inFavorites: boolean;
    show_promo_label: boolean;
    show_promo_price: boolean;
    show_maxima_label: boolean;
    inventory_type: number;
    show_promo_surrogate: boolean;
    giftsCampaignItems: unknown;
    segment_id: unknown;
    id: string;
    title: string;
    category_id: string;
    category_name_full_path: string;
    category_path_url: string;
    root_category_id: string;
    brand_name: string;
    brand_id: number;
    shopcode: string;
    price: number;
    image: string;
    big_image: string;
    comparative_unit: UnitType;
    comparative_unit_price: number;
    comparative_unit_price_brutto: number;
    promotion: unknown;
    promotionGroup: unknown;
    status: "active" | "";
    creationDate: unknown;
    GiftsCampaignItems: unknown;
    own_inventory: boolean;
    ShowInOffersTo: unknown;
    Url: string;
    ExternalSuppliers: unknown;
    is_made_in_Eu: boolean;
    is_made_in_Home_Country: boolean;
    is_available_for_donations: boolean;
};
export type TreeParser = (args: {
    loader: CategoryLoader;
}) => Promise<BaseCategory[]>;
export type CategoryLoader = (url: string) => Promise<Category[]>;
export type Category = {
    id: string;
    parentId: string;
    fullUrl: string;
    position: 0;
    name: string;
    hasEcoProducts: boolean;
    hasNewProducts: boolean;
    hasOfferProducts: boolean;
    hasOfferLoggedInProducts: boolean;
    children: Category[];
};
export {};
//# sourceMappingURL=types.d.ts.map