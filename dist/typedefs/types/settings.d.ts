export type AvailablePlatforms = "vseinstrumenti.ru" | string;
export interface RequestOpts<T extends Record<string, unknown> = any> {
    data: {
        meta?: T;
        remoteId: number;
        text: string;
    };
}
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
}
export interface RequestParameters<T = unknown> extends Pick<BaseRequestParameters<T>, "method" | "headers" | "payload" | "host" | "urlPath"> {
    remoteCategoryId: number;
    page?: number;
}
export interface InitialSettings {
    antibotOpts?: BotDetectorParams;
    perPage: number;
}
export type SettingsHandler = (input: RequestOpts, page?: number) => RequestParameters;
export type RequiredCookies = string[];
export type RequiredHeaders = string[];
//# sourceMappingURL=settings.d.ts.map