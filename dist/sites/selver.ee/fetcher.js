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
import { proxyUrl } from "../../helpers/proxy.js";
export const fetcher = (requestParams) => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    console.log("req params: ", JSON.stringify(requestParams, null, 2));
    const _internal = () => __awaiter(void 0, void 0, void 0, function* () {
        const { data, error } = yield fetcherCore(requestParams);
        if (data) {
            return data;
        }
        yield new Promise((r) => setTimeout(r, 1000));
        console.log("retrying ...", retries);
        retries -= 1;
        if (retries > 0) {
            return yield _internal();
        }
        else {
            return {
                error,
            };
        }
    });
    const data = yield _internal();
    return {
        json: data,
    };
});
const fetcherCore = (requestParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { client, node } = openSearchClient({
        proxyParam: requestParams.proxy,
    });
    const offset = 1000;
    try {
        const data = yield client.search({
            index: "product",
            body: {
                query: {
                    bool: {
                        filter: {
                            bool: {
                                must: [
                                    { terms: { visibility: [2, 3, 4] } },
                                    { terms: { status: [0, 1] } },
                                    {
                                        terms: { category_ids: [+requestParams.remoteCategoryId] },
                                    },
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
                                    "category.category_id": +requestParams.remoteCategoryId,
                                },
                            },
                        },
                    },
                ],
            },
            from: offset * (((_a = requestParams.page) !== null && _a !== void 0 ? _a : 1) - 1),
            size: offset,
        });
        return {
            data: data.body.hits.hits,
            node,
        };
    }
    catch (e) {
        return {
            error: e,
            node,
        };
    }
});
export const openSearchClient = ({ idx = "vue_storefront_catalog_et", proxyParam, }) => {
    const proxy = proxyParam && proxyUrl(proxyParam);
    console.log("proxy: ", proxy);
    const node = `${API_HOST}/${idx}`;
    const client = new Client(Object.assign({ ssl: {
            rejectUnauthorized: false,
        }, compression: "gzip", node }, (proxy ? { proxy } : {})));
    return { client, node };
};
