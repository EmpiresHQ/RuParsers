import { BaseCategory } from "../../types/category.js";
import { treeRootSettings } from "./settings.js";
import { TreeParser } from "./types.js";

export const treeParser: TreeParser = async( {
  rootLoader
}): Promise<BaseCategory[]> => {
  const holder: BaseCategory[] = [];
  const initialData = await rootLoader(treeRootSettings)
  for (const rootCat of initialData.catalogue.catalogue.catalogue.data) {
    holder.push({
      title: rootCat.label,
      id: rootCat.familyId,
      url: rootCat.sitePath.split("/")[2],
    })
  }
  return holder;
}