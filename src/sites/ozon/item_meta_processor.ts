import { OzonItemProcessor } from "./item_processor.js";
import { CharacteristicsOutput, ItemResponseData, OzonItemMetaData } from "./types.js";

export class OzonItemMetaProcessor extends OzonItemProcessor {
  public getPath(itemId: string) {
    return encodeURIComponent(
      `/product/${itemId}?layout_container=pdpPage2column&layout_page_index=2`
    );
  }

  public process(data: ItemResponseData): { err?: unknown; item?: CharacteristicsOutput[] } {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return {err: errChecker.err};
    }
    const parsed = this.stateParser<OzonItemMetaData>(data)
    const characteristics:CharacteristicsOutput[] = []
    if (parsed.webCharacteristics.characteristics) {
      const point = parsed?.webCharacteristics.characteristics
      for (const item of point) {
        for (const long of item.long ?? []) {
          for (const v of long.values) {
            characteristics.push({key: v.key, text: v.text})
          }
        }
        for (const short of item.short ?? []) {
          for (const v of short.values) {
            characteristics.push({key: v.key, text: v.text})
          }
        }
      }
      if (parsed?.webDescription?.characteristics) {
        const point = parsed.webDescription.characteristics;
        for (const item of point) {
          characteristics.push({key: item.title, text: item.content})
        }
      }
      return {
        item: characteristics
      }
    }
    
    return {}
  }

  public filterStates() {
    return [
      "webCharacteristics",
      "webDescription"
    ];
  }
}
