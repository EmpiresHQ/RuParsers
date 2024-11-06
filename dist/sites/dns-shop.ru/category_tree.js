var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { categoryRequestOpts, API_SETTINGS } from "./settings.js";
export const treeLoader = (_a) => __awaiter(void 0, [_a], void 0, function* ({ loader, preloader }) {
    const holder = [];
    const { cookies } = yield preloader(API_SETTINGS);
    if (cookies) {
        const opts = categoryRequestOpts();
        cookies.push({ name: "city_path", value: "moscow" });
        opts.headers = ["cityid: 30b7c1f3-03fb-11dc-95ee-00151716f9f5"];
        const data = (yield loader(opts, cookies)).data.filter((c) => !c.onlyVirtualChildren);
        const tp = (parent, node) => {
            holder.push({
                title: node.title,
                id: node.id,
                url: node.url,
                parent_id: parent.id,
            });
            if (node.childs) {
                for (const child of node.childs.filter(c => !c.onlyVirtualChildren)) {
                    tp(node, child);
                }
            }
        };
        for (const category of data) {
            holder.push({
                title: category.title,
                id: category.id,
                url: category.url,
            });
            if (category.childs) {
                for (const child of category.childs.filter(c => !c.onlyVirtualChildren)) {
                    tp(category, child);
                }
            }
        }
    }
    return holder;
});
