import { InitialSettings, RequestOpts, RequestParameters, RequiredCookies, RequiredHeaders } from "../../types/index.js";
export declare const HOST = "https://www.vseinstrumenti.ru";
export declare const API_HOST = "https://bff.vseinstrumenti.ru";
export declare const restRequestOpts: (handler: RequestOpts, page?: number) => RequestParameters;
export declare const REST_SETTINGS: InitialSettings;
export declare const API_SETTINGS: InitialSettings;
export type ApiPayload = {
    listingType: string;
    id: number;
    page: {
        number: number;
        perPage: number;
    };
};
export declare const apiRequestOpts: (handler: RequestOpts, page?: number) => RequestParameters<ApiPayload>;
export declare const requiredCookies: RequiredCookies;
export declare const requiredHeaders: RequiredHeaders;
//# sourceMappingURL=settings.d.ts.map