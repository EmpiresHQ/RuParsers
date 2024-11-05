type CurlFetchParams = {
    method: "GET" | "POST";
    url?: string;
    urlPath?: string;
    host?: string;
    proxy?: {
        url: string;
        auth?: string;
        os?: string;
    };
    payload?: unknown;
    cookies?: {
        name: string;
        value: string;
    }[];
    headers?: string[];
    jar?: string;
    timeout?: number;
    verbose?: boolean;
};
export declare const curlFetch: <T>(params: CurlFetchParams, load?: "json" | "text" | "buffer") => Promise<T>;
export {};
//# sourceMappingURL=curl.d.ts.map