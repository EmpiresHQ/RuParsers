import { BaseCategory } from "../../types/index.js";
import { openSearchClient } from "./fetcher.js";
import { Category, CategoryContainer, TreeParser } from "./types.js";
export const treeParser: TreeParser = async ({ proxy }) => {
  const { client } = openSearchClient({ proxyParam: proxy });
  try {
    const cats = await client.search<{ hits: { hits: CategoryContainer[] } }>({
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
      const relevant = root.filter(
        (c) =>
          c._source.is_active &&
          // c._source.display_mode === "PRODUCTS" &&
          c._source.include_in_menu == 1 &&
          ![346, 347, 348, 349, 357, 417, 434].includes(c._source.id)
      );
      const holder: BaseCategory[] = [];
      const tp = (parent: Category, node: Category) => {
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
        })
        if (cat._source.children_data) {
          for (const child of cat._source.children_data) {
            tp(cat._source, child)
          }
        }
      }
      return holder
    }
    return []
  } catch (e) {
    console.log(e);
    console.log(JSON.stringify(e, null, 2));
    return []
  }
};
