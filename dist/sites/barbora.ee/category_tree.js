var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const treeParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ loader }) {
    const holder = [];
    const categories = yield loader("https://production-elb.barbora.lt/api/cache/v1/country/EE/categories");
    const tp = (parent, node) => {
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
                console.log(category);
                tp(category, child);
            }
        }
    }
    return holder;
});
