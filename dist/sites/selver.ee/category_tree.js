var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { openSearchClient } from "./fetcher.js";
export const treeParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ proxy }) {
    const { client } = openSearchClient({ proxyParam: proxy });
    try {
        const cats = yield client.search({
            index: "category",
            body: {
                query: {
                    bool: {
                        filter: {
                            bool: {
                                must: [
                                    { terms: { level: [3] } },
                                    { terms: { is_active: [true] } },
                                ],
                            },
                        },
                    },
                },
            },
            size: 4000,
            sort: "position:asc",
        });
        if (cats.body.hits.hits) {
            const root = cats.body.hits.hits;
            const relevant = root.filter((c) => c._source.is_active &&
                // c._source.display_mode === "PRODUCTS" &&
                c._source.include_in_menu == 1 &&
                ![346, 347, 348, 349, 357, 417, 434].includes(c._source.id));
            const holder = [];
            const tp = (parent, node) => {
                holder.push({
                    title: node.name,
                    id: node.id,
                    url: node.url_path,
                    parent_id: parent.id.toString(),
                });
                if (node.children_data && node.children_data.length) {
                    for (const child of node.children_data) {
                        tp(node, child);
                    }
                }
            };
            for (const cat of relevant) {
                holder.push({
                    title: cat._source.name,
                    id: cat._source.id,
                    url: cat._source.url_path,
                });
                if (cat._source.children_data) {
                    for (const child of cat._source.children_data) {
                        tp(cat._source, child);
                    }
                }
            }
            return holder;
        }
        return [];
    }
    catch (e) {
        console.log(e);
        console.log(JSON.stringify(e, null, 2));
        return [];
    }
});
