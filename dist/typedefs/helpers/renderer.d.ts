export interface Cookie {
    name: string;
    value: string;
}
export interface RenderResult {
    cookies?: Cookie[];
    evaluatedValue?: unknown;
    screenshot?: string;
    body?: string;
    documentBody?: string;
}
export type ProcessBodyParams = {
    url: string | string[];
    fetchCookies?: {
        domains: string[];
        cookieNames?: string[];
    };
    getBody?: boolean;
    getDocumentBody?: boolean;
    cookies?: Cookie[];
    waitBeforeLoad?: number;
    waitAfterLoad?: number;
    waitForElement?: string;
    evaluateRuntime?: string;
    takeScreenshot?: boolean;
    onlyFailed?: boolean;
    waitUrl?: string;
    waitUrlFallback?: boolean;
    setPageContent?: string;
    waitNetworkCookie?: {
        domain: string;
        name: string;
    };
    proxy?: {
        url: string;
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
};
export declare const renderer: (params: ProcessBodyParams) => Promise<RenderResult>;
//# sourceMappingURL=renderer.d.ts.map