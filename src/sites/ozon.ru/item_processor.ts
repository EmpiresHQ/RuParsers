import {
  ItemParsedData,
  BaseResponseData,
  OzonItemPrice,
  ResponseOzonItem,
} from "./types.js";
import {  OzonBase } from "./base.js";
import { BaseItemArgs, BaseItemResponse } from "../../types/index.js";
import { ItemBase } from "../../base/index.js";

export interface FetchItemResponse extends BaseItemResponse {
  item?: ResponseOzonItem;
}

export class OzonItemProcessor extends OzonBase implements ItemBase<BaseItemArgs, FetchItemResponse> {
  public async fetchItem({
    itemId,
    preloadedCookies,
    proxy,
  }: BaseItemArgs): Promise<FetchItemResponse> {
    const { cookies } = await this.getCookies({ preloadedCookies, proxy });
    if (!cookies) {
      throw new Error("could not fetch cookies");
    }
    const data = await this.request({
      opts: { proxy },
      cookiesHeaders: { cookies },
      pathLoader: () => ({ args: [itemId] }),
    });
    const parsed = this.process(data);
    return {
      ...parsed,
      cookiesHeaders: { cookies },
    };
  }

  public getPath({ args }: { args: string[] }) {
    return encodeURIComponent(`/product/${args[0]}`);
  }

  public process(data: BaseResponseData): FetchItemResponse {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return { err: errChecker.err };
    }
    const parsed = this.stateParser<ItemParsedData>(data);

    if (parsed.userAdultModal) {
      return {
        err: "adult",
      };
    }
    // console.log(resp.url)
    // console.log(parsed.tileGrid2);
    // console.log(JSON.stringify(parsed.searchResultsV2, null ,2));

    // const items = categoryItemsParser(parsed.searchResultsV2);
    let item: ResponseOzonItem | undefined = undefined;
    if (parsed.webOutOfStock) {
      item = {
        isAvailable: false,
        skuId: parsed.webOutOfStock.sku,
        regularPrice: "",
      };
    }
    if (parsed["webPrice-"]) {
      item = this.itemParser({
        webPrice: parsed["webPrice-"],
        sku: parsed.webReviewProductScore
          ? parsed.webReviewProductScore.itemId.toString()
          : parsed.webProductMainWidget
            ? parsed.webProductMainWidget.sku
            : parsed.webAddToFavorite.sku,
      });
    }
    // throw "die";
    return {
      item,
    };
  }

  public itemParser({
    webPrice,
    sku,
  }: {
    webPrice: OzonItemPrice;
    sku: string;
  }): ResponseOzonItem {
    return {
      skuId: sku,
      discountPrice: webPrice.cardPrice,
      regularPrice: webPrice.originalPrice,
      isAvailable: webPrice.isAvailable,
    };
  }

  public filterStates() {
    return [
      "webPrice-",
      "userAdultModal",
      "webReviewProductScore",
      "webOutOfStock",
      "webProductMainWidget",
      "webAddToFavorite",
    ];
  }
}
