import { BaseCategory } from "../../types/index.js";
import { categoryRequestOpts, API_SETTINGS } from "./settings.js";
import { Category, TreeParser } from "./types.js";

export const treeLoader: TreeParser = async ({ loader, preloader }) => {
  const holder: BaseCategory[] = [];
  const { cookies } = await preloader(API_SETTINGS);
  if (cookies) {
    const opts = categoryRequestOpts();
    cookies.push({ name: "city_path", value: "moscow" });
    opts.headers = ["cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5"];
    const data = (await loader(opts, cookies)).data.filter(
      (c) => !c.onlyVirtualChildren
    );

    const tp = (parent: Category, node: Category) => {
      holder.push({
        title: node.title,
        id: node.id,
        url: node.url,
        parent_id: parent.id,
      })
      if (node.childs) {
        for (const child of node.childs.filter(c => !c.onlyVirtualChildren)) {
          tp(node, child);
        }
      }
    }

    for (const category of data) {
      holder.push({
        title: category.title,
        id: category.id,
        url: category.url,
      });
      if (category.childs) {
        for (const child of category.childs.filter(c => !c.onlyVirtualChildren)){
          tp(category, child)
        }
      }
    }
  }

  return holder;
};
