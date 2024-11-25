import { BaseItem } from "../../types/index.js";
export interface ItemResponseData {
    widgetStates: {
        [key in string]: string;
    };
    layoutTrackingInfo: unknown;
    incidentId?: string;
    challengeURL?: string;
    pageInfo?: {
        pageType?: "error";
    };
}
export type ItemParsedData = {
    "webPrice-": OzonItemPrice;
    webReviewProductScore?: OzonItemRating;
    userAdultModal: unknown;
    webOutOfStock: {
        sku: string;
    };
    webProductMainWidget?: {
        sku: string;
    };
    webAddToFavorite: {
        sku: string;
    };
};
export interface ResponseOzonItem extends BaseItem {
    reviews?: OzonReviews;
    cardPrice?: string;
}
export interface OzonItemPrice {
    price: string;
    originalPrice: string;
    cardPrice: string;
    isAvailable: boolean;
}
export interface OzonItemRating {
    itemId: number;
    reviewsCount: number;
    totalScore: number;
}
export interface OzonCategory {
    url: string;
    title: string;
    id: number;
    parent_id?: number;
}
export interface OzonReviews {
    rank: string;
    count: string;
}
type ItemsArray = {
    mainState: Array<{
        atom: Atom;
    }>;
    rightState?: Array<{
        atom: Atom;
    }>;
    skuId?: string;
    action?: {
        link: string;
    };
    tileImage: TileImage;
};
type TileImageItem = {
    type: "image" | "video";
    image: {
        link: string;
        contentMode: string;
    };
};
type TileImage = {
    imageRatio: string;
    items: TileImageItem[];
};
type TilesArray = {
    mainState: Atom[];
    rightState?: Atom[];
    skuId?: string;
    tileImage: TileImage;
    action?: {
        link: string;
    };
};
type SkuGridArray = {
    state: Atom[];
    skuId?: string;
    link: string;
};
export interface OzonTag extends OzonCategory {
}
export type AtomTypes = "priceV2" | "stockBar" | "textAtom" | "labelList";
export interface SearchResults {
    items: ItemsArray[];
}
export interface SearchTileResults {
    items: TilesArray[];
}
export interface SearchSkuGridPath {
    productContainer: SearchSkuGridResults & {
        options: unknown;
    };
}
export interface SearchSkuGridResults {
    products: SkuGridArray[];
}
interface Atom {
    priceV2: {
        price: Array<{
            text?: string;
        }>;
    };
    stockBar?: {
        text: string;
    };
    labelList?: {
        items: Array<{
            title: string;
        }>;
    };
    textAtom?: {
        maxLines: number;
        text: string;
    };
    type: AtomTypes;
}
export type SearchAtomTypes = "priceV2" | "textAtom" | "labelList" | "stockBar";
export type OzonItemMetaData = {
    webCharacteristics: OzonItemWebCharacteristic;
    webDescription: OzonItemWebDescription;
};
type OzonItemDescriptionCharacteristic = {
    content: string;
    title: string;
};
export type OzonItemWebDescription = {
    characteristics: OzonItemDescriptionCharacteristic[];
};
type OzonItemCharacteristicChunk = {
    key: string;
    name: string;
    values: {
        key: string;
        text: string;
    }[];
};
export type OzonItemCharacteristic = {
    title: string;
    short: OzonItemCharacteristicChunk[];
    long: OzonItemCharacteristicChunk[];
};
export type OzonItemWebCharacteristic = {
    totalCount: number;
    productTitle: string;
    characteristics: OzonItemCharacteristic[];
};
export type CharacteristicsOutput = {
    key: string;
    text: string;
};
export {};
//# sourceMappingURL=types.d.ts.map