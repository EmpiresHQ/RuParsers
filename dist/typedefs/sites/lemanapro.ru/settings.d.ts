import { AntiBotKey, InitialSettings, RequestOpts, RequestParameters } from "../../types/index.js";
import { ApiPayload } from "./index.js";
export declare const API_HOST = "https://api.lemanapro.ru";
export declare const HOST = "https://lemanapro.ru";
export declare const API_SETTINGS: InitialSettings;
export declare const treeRootSettings: InitialSettings;
export declare const apiRequestOpts: (handler: RequestOpts<AntiBotKey & {
    key: string;
}>, page?: number) => RequestParameters<ApiPayload>;
//# sourceMappingURL=settings.d.ts.map