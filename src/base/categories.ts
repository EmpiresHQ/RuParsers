import { ProcessBodyParams } from "../helpers/renderer.js";
import {
  BaseCategoryArgs,
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../types/index.js";
import { RequestBase } from "./request.js";

export abstract class CategoryBase<
  C extends BaseCategoryArgs,
  T extends BaseCategoryResponse<Record<string, unknown>>,
> {
  public abstract fetchCategory(
    args: C
  ): Promise<T | BaseCategoryErrorResponse>;
  public abstract getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">
}

export class BaseClass
  extends RequestBase
  implements CategoryBase<BaseCategoryArgs, BaseCategoryResponse>
{

  async fetchCategory(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: BaseCategoryArgs
  ): Promise<
    BaseCategoryResponse<Record<string, unknown>> | BaseCategoryErrorResponse
  > {
    return {
      err: undefined,
    };
  }
  getCookieLoaderParams(): Omit<Partial<ProcessBodyParams>, "proxy">{
    return {};
  }
}
