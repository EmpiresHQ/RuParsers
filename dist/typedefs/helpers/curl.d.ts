type CurlFetchParams = {
    method: "GET" | "POST";
    url: string;
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
export declare const curlFetch: (params: CurlFetchParams, load?: "json" | "text" | "buffer") => Promise<unknown>;
export {};
//# sourceMappingURL=curl.d.ts.map