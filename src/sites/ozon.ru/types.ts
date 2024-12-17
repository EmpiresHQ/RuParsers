import { BaseItem } from "../../types/index.js";

export interface BaseResponseData {
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

export type CategoryResponseData = BaseResponseData & {
  nextPage?: string;
  no_results: unknown;
};

export type CategoryParsedData = {
  megaPaginator: {
    nextPage: string;
  };
  searchResultsV2: SearchResults;
  tagList: unknown;
  filtersDesktop: FiltersDesktop;
};

export type FiltersDesktop = {
  sections: {
    filters: {
      categoryFilter: {
        title: string;
        categories: {
          title: string;
          level: number;
          urlValue: string;
          isActive?: boolean;
        }[];
      };
      key: string;
      type: "categoryFilter" | "boolFilter";
    }[];
  }[];
};

export interface ResponseOzonItem extends BaseItem<{
  reviews?: OzonReviews;
  cardPrice?: string;
  filters?: CharacteristicsOutput[]
}> {}

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
  skuId: string;
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

export interface OzonTag extends OzonCategory {}
export type AtomTypes = "priceV2" | "stockBar" | "textAtom" | "labelList";

export type SearchResults = {
  items: ItemsArray[];
};

export interface SearchTileResults {
  items: TilesArray[];
}

export interface SearchSkuGridPath {
  productContainer: SearchSkuGridResults & { options: unknown };
}

export interface SearchSkuGridResults {
  products: SkuGridArray[];
}

interface Atom {
  priceV2: { price: Array<{ text?: string }> };
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
  webShortCharacteristics: OzonItemShortCharacteristicsChunk;
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

type OzonItemShortCharacteristicsChunk = {
  characteristics: {
    id: string;
    title: {
      textRs: {
        type: string;
        content: string;
      }[];
    };
    values: {
      id: string;
      text: string;
    }[];
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
