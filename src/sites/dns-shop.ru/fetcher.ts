import {
  BaseRequestParameters,
  RequestParameters,
} from "../../types/index.js";
import { imageRequestOpts, priceRequestOpts } from "./settings.js";
import {
  AjaxState,
  CategoryResponse,
  DNSItem,
  ImageResponse,
  PriceResponse,
  WindowDNS,
} from "./types.js";
import * as vm from "node:vm";

export const fetcher = async (
  requestParams: RequestParameters,
  loader?: (opts: BaseRequestParameters) => unknown
): Promise<DNSItem[] | { error: string }> => {
  if (!loader) {
    return {
      error: "noloader",
    };
  }
  const data = (await loader(requestParams)) as CategoryResponse;
  console.log('data: ', data);
  const productContainer = Object.entries(data.assets.inlineJs).find(
    ([, value]) => {
      return value.includes("AjaxState.register");
    }
  );
  if (!productContainer) {
    // return {
      // error: "notfound",
    // };
    return []
  }
  
  const productsString = data.assets.inlineJs[productContainer[0]];

  let store: AjaxState | undefined = [];
  const ctx: WindowDNS = {
    window: {
      AjaxState: {
        register: (data) => {
          store = data as AjaxState;
        },
      },
    },
  };
  vm.createContext(ctx);
  vm.runInContext(productsString, ctx);

  if (!store || !store.length) {
    // return {
    //   error: "notparsed",
    // };
    return []
  }
  const chunk = store.find((chunk) => chunk[0].type === "product-buy");
  if (!chunk || chunk.length < 2) {
    // return {
    //   error: "noproducts",
    // };
    return []
  }
  const pricePayload = chunk[1].map(({ id, data: { id: dId } }) => ({
    id,
    data: { id: dId },
  }));

  const priceOpts = priceRequestOpts(pricePayload);
  const priceData = (await loader(priceOpts)) as PriceResponse;

  const productIds = priceData.data.states.map((state) => state.data.id);
  const imageOpts = imageRequestOpts(productIds);
  const imageData = (await loader(imageOpts)) as ImageResponse;

  const out = priceData.data.states.map((state) => ({
    ...state,
    images: imageData.data[state.data.id],
  }));
  // console.log(out)

  return out;
};
