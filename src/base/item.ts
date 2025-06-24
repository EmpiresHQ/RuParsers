import { ProcessBodyParams } from "../helpers/renderer.js";
import {
  BaseCategoryErrorResponse,
  BaseItemArgs,
  BaseItemResponse,
} from "../types/index.js";
import { RequestBase } from "./request.js";

export abstract class ItemBase<
  C extends BaseItemArgs,
  T extends BaseItemResponse<Record<string, unknown>>,
> {
  public abstract fetchItem(args: C): Promise<T | BaseCategoryErrorResponse>;
}

export class BaseClass
  extends RequestBase
  implements ItemBase<BaseItemArgs, BaseItemResponse>
{
  async fetchItem(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: BaseItemArgs
  ): Promise<
    BaseItemResponse<Record<string, unknown>> | BaseCategoryErrorResponse
  > {
    return {
      err: undefined,
    };
  }
  public getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy"> {
    return {
      url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/category/7000`)})`,
      waitAfterLoad: 4000,
      getDocumentBody: true,
      fetchCookies: {
        domains: ["https://www.ozon.ru"],
        cookieNames: ["abt_data", "__Secure-ETC", "TS012*"],
      },
    };
  }
}
