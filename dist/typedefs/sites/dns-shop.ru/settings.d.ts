import { AntiBotKey, InitialSettings, RequestOpts, RequestParameters } from "../../types/index.js";
import { PricePayload } from "./index.js";
export declare const API_HOST = "https://restapi.dns-shop.ru/v1";
export declare const WEB_HOST = "https://www.dns-shop.ru";
export declare const API_SETTINGS: InitialSettings;
export declare const categoryRequestOpts: () => RequestParameters<unknown>;
export declare const apiRequestOpts: (handler: RequestOpts<AntiBotKey>, page?: number) => RequestParameters;
export declare const priceRequestOpts: (pl: PricePayload[]) => RequestParameters<string>;
export declare const imageRequestOpts: (imageIds: string[]) => RequestParameters<string>;
//# sourceMappingURL=settings.d.ts.map