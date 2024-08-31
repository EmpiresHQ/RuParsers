import { BaseItem } from "../../types/item.js";
export interface Item extends BaseItem {
}
export type LemanaItem = {
    productPriceCategory: string;
    isFromParentFamily: boolean;
    familyId: string;
    price: {
        additional_as_main: boolean;
        currency: "RUB" | string;
        main_price: number;
        previous_price: number;
        main_uom: string;
        main_uom_rus: string;
        additional_price: number;
        previous_additional_price: number;
        step: number;
    };
    productLink: string;
    displayedName: string;
    eligibility: {
        homeDeliveryEligible: boolean;
        relayPointEligible: boolean;
        storeDeliveryEligible: boolean;
        webEligible: boolean;
    };
    mediaMainPhoto: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    brand: string;
    source: string;
    productId: string;
    measurementData?: {
        productMeasurementType?: unknown;
        width?: number;
        m2PerBox?: number;
    };
};
export type Sorts = {
    id: string;
    name: string;
    isDefault: boolean;
};
export type Page = {
    totalCount: number;
    familyName: string;
    content: LemanaItem[];
};
export type ApiPayload = {
    familyIds: string[];
    limit: number;
    regionId: string;
    facets?: [];
    suggest?: boolean;
    offset: number;
};
export interface PLPModel {
    plp: {
        pageModel: {
            model: {
                properties: {
                    familyId: string;
                };
            };
        };
        products: {
            productsCount: string;
        };
    };
    env: {
        apiKey: string;
        requestID: string;
    };
}
//# sourceMappingURL=types.d.ts.map