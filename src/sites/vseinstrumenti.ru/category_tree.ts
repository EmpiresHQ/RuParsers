import { digitMatcher } from "../../index.js";
import { BaseCategory } from "../../types/index.js";
import {
  treeChildOpts,
  treeLeafOpts,
  TreeParser,
  treeRootOpts,
} from "./index.js";

export const treeParser: TreeParser = async ({
  rootLoader,
  leafLoader,
  childLoader,
}): Promise<BaseCategory[]> => {
  const rootRequestParameters = treeRootOpts();
  const root = await rootLoader(rootRequestParameters);
  const holder: BaseCategory[] = [];
  for (const data of root.data) {
    const leafOpts = treeLeafOpts({ remoteCategoryId: data.groupId });
    const leafs = await leafLoader(leafOpts);
    for (const leaf of leafs) {
      const id = digitMatcher(leaf.url);
      if (id) {
        holder.push({
          title: leaf.name,
          id,
          url: leaf.url,
        });
        for (const child of leaf.children) {
          holder.push({
            title: child.name,
            id: child.id,
            url: child.url,
            parent_id: id,
          });
          if (child.isSubcategoriesExist) {
            const subChildOpts = treeChildOpts({
              left: child.leftBorder,
              right: child.rightBorder,
            });
            const subChildren = await childLoader(subChildOpts);
            if (subChildren) {
              for ( const subChild of subChildren) {
                holder.push({
                  id: subChild.id,
                  title: subChild.name,
                  url: subChild.url,
                  parent_id: child.id.toString()
                })
              }
            }
          }
        }
      }
    }
  }
  return holder;
};
