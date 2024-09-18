export type AvailablePlatforms = "vseinstrumenti.ru" | string;
import type { Merge } from "type-fest";
export interface RequestOpts<T = AntiBotKey> {
    data: {
        meta?: T;
        remoteId: string;
        text: string;
    };
}
export interface AntiBotKey {
    antibotData?: AntibotData;
}
export type AntibotData = {
    cookies?: {
        name: string;
        value: string;
    }[];
    evaluatedValue?: unknown;
    screenshot?: string;
    body?: string;
    documentBody?: string;
};
export interface BotDetectorParams {
    url: string | string[];
    fetchCookies?: {
        domains: string[];
        cookieNames?: string[];
    };
    getBody?: boolean;
    getDocumentBody?: boolean;
    waitBeforeLoad?: number;
    waitAfterLoad?: number;
    waitForElement?: string;
    evaluateRuntime?: string;
    takeScreenshot?: boolean;
    onlyFailed?: boolean;
    waitUrl?: string;
    waitUrlFallback?: boolean;
    waitNetworkCookie?: {
        domain: string;
        name: string;
    };
    os?: string;
    settings?: {
        loadMedia?: boolean;
        requestTimeout?: number;
        screenShot?: {
            format?: "jpeg" | "png" | "webp";
            quality?: number;
            fromSurface?: boolean;
            captureBeyondViewport?: boolean;
        };
        browser?: {
            window: {
                width: number;
                height: number;
            };
            userAgent?: string;
            userAgentMetadata?: {
                platform?: string;
                model?: string;
                mobile?: boolean;
                fullVersion?: string;
                brands?: Array<{
                    brand: string;
                    version: string;
                }>;
                architecture?: string;
                platformVersion?: string;
            };
        };
    };
}
export interface BaseRequestParameters<T = unknown> {
    method: "GET" | "POST";
    urlPath: string;
    host?: string;
    payload?: T;
    cookies?: string;
    headers?: string[];
    timeout?: number;
}
export interface RequestParameters<T = unknown> extends Pick<BaseRequestParameters<T>, "method" | "headers" | "payload" | "host" | "urlPath" | "timeout"> {
    remoteCategoryId: string;
    page?: number;
}
export interface InitialSettings {
    antibotOpts?: BotDetectorParams;
    perPage: number;
}
export type SettingsHandler<T extends Merge<AntiBotKey, unknown> = Merge<AntiBotKey, unknown>> = (input: RequestOpts<T>, page?: number) => RequestParameters;
export type RequiredCookies = string[];
export type RequiredHeaders = string[];
//# sourceMappingURL=settings.d.ts.map