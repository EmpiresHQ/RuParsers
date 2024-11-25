import {
  ItemParsedData,
  ItemResponseData,
  OzonItemPrice,
  ResponseOzonItem,
} from "./types.js";
import { BaseFetcherArgs, OzonBase } from "./base.js";



interface FetchItemArgs extends BaseFetcherArgs {
  itemId: string;
}

export class OzonItemProcessor extends OzonBase {
  
  async fetchItem({ itemId, preloadedCookies, proxy }: FetchItemArgs) {
    const cookies = await this.getCookies({ preloadedCookies, proxy });
    if (!cookies) {
      throw new Error('could not fetch cookies')
    }
    const data = await this.itemRequest({
      opts: { proxy },
      cookies,
      pathLoader: () => [itemId]
    });
    const parsed = this.process(data);
    return parsed;
  }

  public getPath(...args: string[]) {
    return encodeURIComponent(`/product/${args[0]}`);
  }
  
  public process(data: ItemResponseData): { err?: unknown; item?: unknown } {
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
