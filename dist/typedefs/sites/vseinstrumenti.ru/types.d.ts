import { BaseItem } from "../../types/index.js";
export interface Item extends BaseItem {
}
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
    code: string;
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
    id: number;
    image: string;
    images: string[];
    isAvailable: boolean;
    isConsumable: boolean;
    isLastPrice: boolean;
    link: string;
    makeId: number;
    name: string;
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
        averageRatio: number;
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
//# sourceMappingURL=types.d.ts.map