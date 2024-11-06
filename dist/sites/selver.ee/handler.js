var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from "@opensearch-project/opensearch";
import { API_HOST } from "./settings.js";
export const ctxLoader = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (args && args.proxy) {
        const [user, pass] = ((_a = args.proxy.auth) !== null && _a !== void 0 ? _a : "").split(":");
        const url = new URL(args.proxy.url);
        if (user && pass) {
            url.username = user;
            url.password = pass;
        }
        return {
            search: new Client({
                node: `${API_HOST}/product`,
                proxy: url.toString(),
            }),
        };
    }
});
export const handler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, handler: requestHandler, page, }) {
    const data = yield ctx.search.search({
        index: "product",
        body: {
            query: {
                bool: {
                    filter: {
                        bool: {
                            must: [
                                { terms: { visibility: [2, 3, 4] } },
                                { terms: { status: [0, 1] } },
                                { terms: { category_ids: [+requestHandler.data.remoteId] } },
                            ],
                        },
                    },
                },
            },
            sort: [
                {
                    "category.position": {
                        order: "asc",
                        nested_path: "category",
                        nested_filter: {
                            term: {
                                "category.category_id": +requestHandler.data.remoteId,
                                // "category.category_id": 210,
                            },
                        },
                    },
                },
            ],
        },
        from: page * 200,
        size: 200,
    });
    console.log(data);
    return {
        items: [],
        hasNextPage: false,
    };
});
