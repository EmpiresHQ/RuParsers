import {
  BaseCategoryArgs,
  BaseCategoryErrorResponse,
  BaseCategoryResponse,
} from "../types/index.js";
import { RequestBase } from "./index.js";

export abstract class CategoriesBase<
  C extends BaseCategoryArgs,
  T extends BaseCategoryResponse<Record<string, unknown>>,
> {
  public abstract fetchCategory(
    args: C
  ): Promise<T | BaseCategoryErrorResponse>;
}


export class BaseClass extends RequestBase
implements CategoriesBase<BaseCategoryArgs, BaseCategoryResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchCategory(_args: BaseCategoryArgs): Promise<BaseCategoryResponse<Record<string, unknown>> | BaseCategoryErrorResponse> {
      return {
        err: undefined
      };
  }  
}