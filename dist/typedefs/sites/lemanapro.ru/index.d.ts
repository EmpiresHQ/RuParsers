export * from "./category_parser.js";
export * from "./types.js";
export declare const strategies: {
    api: {
        parser: import("../../types/index.js").CategoryParser<import("./types.js").Page>;
        opts: (handler: import("../../types/settings.js").RequestOpts<import("../../types/settings.js").AntiBotKey & {
            key: string;
        }>, page?: number) => import("../../types/settings.js").RequestParameters<import("./types.js").ApiPayload>;
        settings: import("../../types/settings.js").InitialSettings;
    };
};
export declare const preferredStrategy = "api";
//# sourceMappingURL=index.d.ts.map