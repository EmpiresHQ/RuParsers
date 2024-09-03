var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HOST, treeRootSettings } from "./settings.js";
export const treeParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rootLoader, childLoader, }) {
    const holder = [];
    const { data, cookies } = yield rootLoader(treeRootSettings);
    console.log(cookies);
    const treeParser = (parent, node) => {
        holder.push({
            title: node.label,
            id: node.familyId,
            url: node.sitePath.split("/")[2],
            parent_id: parent.familyId,
        });
        if (node.children) {
            for (const child of node.children) {
                treeParser(node, child);
            }
        }
    };
    for (const rootCat of data.catalogue.catalogue.catalogue.data) {
        holder.push({
            title: rootCat.label,
            id: rootCat.familyId,
            url: rootCat.sitePath.split("/")[2],
        });
        const child = yield childLoader({
            method: "GET",
            host: HOST,
            urlPath: rootCat.navigationChunk,
        }, cookies);
        console.log('child: ', child.familyId, 'children: ', child.children.length);
        if (child.children) {
            for (const ch of child.children) {
                treeParser(rootCat, ch);
            }
        }
    }
    return holder;
});
