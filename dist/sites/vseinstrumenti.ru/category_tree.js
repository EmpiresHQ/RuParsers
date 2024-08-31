var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { digitMatcher } from "../../index.js";
import { treeChildOpts, treeLeafOpts, treeRootOpts, } from "./index.js";
export const treeParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rootLoader, leafLoader, childLoader, }) {
    const rootRequestParameters = treeRootOpts();
    const root = yield rootLoader(rootRequestParameters);
    const holder = [];
    for (const data of root.data) {
        const leafOpts = treeLeafOpts({ remoteCategoryId: data.groupId });
        const leafs = yield leafLoader(leafOpts);
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
                        const subChildren = yield childLoader(subChildOpts);
                        if (subChildren) {
                            for (const subChild of subChildren) {
                                holder.push({
                                    id: subChild.id,
                                    title: subChild.name,
                                    url: subChild.url,
                                    parent_id: child.id
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return holder;
});
