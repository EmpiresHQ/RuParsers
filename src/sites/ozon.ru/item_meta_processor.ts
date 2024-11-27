import { FetchItemArgs, FetchItemResponse, OzonItemProcessor } from "./item_processor.js";
import {
  CharacteristicsOutput,
  BaseResponseData,
  OzonItemMetaData,
} from "./types.js";

interface FetchItemMetaResponse extends Omit<FetchItemResponse, 'item'> {
  characteristics?: CharacteristicsOutput[]
}

export class OzonItemMetaProcessor extends OzonItemProcessor {
  public getPath({ args }: { args: string[] }) {
    return encodeURIComponent(
      `/product/${args[0]}?layout_container=pdpPage2column&layout_page_index=2`
    );
  }

  public async fetchItem(args: FetchItemArgs) {
    return super.fetchItem(args) as Promise<FetchItemMetaResponse>;
  }

  public process(
    data: BaseResponseData
  ): { characteristics?: CharacteristicsOutput[] } & FetchItemResponse {
    const errChecker = this.checkError(data);
    if (errChecker.err) {
      return { err: errChecker.err };
    }
    const parsed = this.stateParser<OzonItemMetaData>(data);
    const characteristics: CharacteristicsOutput[] = [];
    if (parsed?.webCharacteristics?.characteristics) {
      const point = parsed?.webCharacteristics.characteristics;
      for (const item of point) {
        for (const long of item.long ?? []) {
          for (const v of long.values) {
            characteristics.push({ key: v.key, text: v.text });
          }
        }
        for (const short of item.short ?? []) {
          for (const v of short.values) {
            characteristics.push({ key: v.key, text: v.text });
          }
        }
      }
    }
    if (parsed?.webDescription?.characteristics) {
      const point = parsed.webDescription.characteristics;
      for (const item of point) {
        characteristics.push({ key: item.title, text: item.content });
      }
    }
    if (parsed?.webShortCharacteristics?.characteristics) {
      const point = parsed.webShortCharacteristics.characteristics;
      for (const item of point) {
        characteristics.push({
          key: item.id,
          text: item.values[0].text,
        });
      }
    }

    return {
      characteristics,
    };
  }

  public filterStates() {
    return ["webCharacteristics", "webDescription", "webShortCharacteristics"];
  }
}
