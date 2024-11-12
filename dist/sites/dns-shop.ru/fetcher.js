var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseProcessorError } from "../../types/error.js";
import { imageRequestOpts, priceRequestOpts } from "./settings.js";
import * as vm from "node:vm";
export const fetcher = (requestParams, loader) => __awaiter(void 0, void 0, void 0, function* () {
    if (!loader) {
        return {
            error: "noloader",
        };
    }
    const data = (yield loader(requestParams));
    console.log('data: ', data);
    const productContainer = Object.entries(data.assets.inlineJs).find(([, value]) => {
        return value.includes("AjaxState.register");
    });
    if (!productContainer) {
        // return {
        // error: "notfound",
        // };
        return [];
    }
    const productsString = data.assets.inlineJs[productContainer[0]];
    let store = [];
    const ctx = {
        window: {
            AjaxState: {
                register: (data) => {
                    store = data;
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
        return [];
    }
    const chunk = store.find((chunk) => chunk[0].type === "product-buy");
    if (!chunk && (!requestParams.page || requestParams.page == 0)) {
        return {
            error: BaseProcessorError.NotFound
        };
    }
    if (!chunk || chunk.length < 2) {
        // return {
        //   error: "noproducts",
        // };
        return [];
    }
    const pricePayload = chunk[1].map(({ id, data: { id: dId } }) => ({
        id,
        data: { id: dId },
    }));
    const priceOpts = priceRequestOpts(pricePayload);
    const priceData = (yield loader(priceOpts));
    const productIds = priceData.data.states.map((state) => state.data.id);
    const imageOpts = imageRequestOpts(productIds);
    const imageData = (yield loader(imageOpts));
    const out = priceData.data.states.map((state) => (Object.assign(Object.assign({}, state), { images: imageData.data[state.data.id] })));
    // console.log(out)
    return out;
});
