import { BaseCategory } from "../../types/category.js";
import { HOST, treeRootSettings } from "./settings.js";
import { CatalogueItem, TreeParser } from "./types.js";

export const treeParser: TreeParser = async ({
  rootLoader,
  childLoader,
}): Promise<BaseCategory[]> => {
  const holder: BaseCategory[] = [];
  const { data, cookies } = await rootLoader(treeRootSettings);
  console.log(cookies);

  const treeParser = (parent: CatalogueItem, node: CatalogueItem) => {
    holder.push({
      title: node.label,
      id: node.familyId,
      url: node.sitePath.split("/")[2],
      parent_id: parent.familyId,
    })
    if (node.children) {
      for (const child of node.children) {
        treeParser(node, child);
      }
    }
  }
  for (const rootCat of data.catalogue.catalogue.catalogue.data) {
    holder.push({
      title: rootCat.label,
      id: rootCat.familyId,
      url: rootCat.sitePath.split("/")[2],
    });
    const child = await childLoader(
      {
        method: "GET",
        host: HOST,
        urlPath: rootCat.navigationChunk,
      },
      cookies
    );
    console.log('child: ', child.familyId, 'children: ', child.children.length)
    if (child.children) {
      for (const ch of child.children) {
        treeParser(rootCat, ch)
      }
    }
  }
  return holder;
};
