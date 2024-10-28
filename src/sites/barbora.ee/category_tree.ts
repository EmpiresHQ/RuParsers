import { BaseCategory } from "../../types/category.js";
import { Category, TreeParser } from "./types.js";

export const treeParser: TreeParser = async ({ loader }) => {
  const holder: BaseCategory[] = [];
  const categories = await loader(
    "https://production-elb.barbora.lt/api/cache/v1/country/EE/categories"
  );
  const tp = (parent: Category, node: Category) => {
    holder.push({
      title: node.name,
      id: node.fullUrl,
      url: node.fullUrl,
      parent_id: parent.fullUrl,
    });
    if (node.children && node.children.length) {
      for (const child of node.children) {
        tp(node, child);
      }
    }
  };
  for (const category of categories) {
    holder.push({
      title: category.name,
      id: category.fullUrl,
      url: category.fullUrl,
    });
    if (category.children) {
      for (const child of category.children) {
        console.log(category)
        tp(category, child);
      }
    }
  }
  return holder;
};
