var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { treeRootSettings } from "./settings.js";
export const treeParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rootLoader }) {
    const holder = [];
    const initialData = yield rootLoader(treeRootSettings);
    for (const rootCat of initialData.catalogue.catalogue.catalogue.data) {
        holder.push({
            title: rootCat.label,
            id: rootCat.familyId,
            url: rootCat.sitePath.split("/")[2],
        });
    }
    return holder;
});
