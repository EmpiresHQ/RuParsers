var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { flatten } from "lodash";
import lodash from "lodash";
const { flatten } = lodash;
import { OzonCategoryProcessor, } from "./category_processor.js";
import { sleeper } from "../../helpers/sleeper.js";
export class OzonSellerCategoryProcessor extends OzonCategoryProcessor {
    fetchCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, categoryUrl, preloadedCookies, proxy, page = 1, sellerId, }) {
            const { cookies } = yield this.getCookies({ preloadedCookies, proxy });
            // console.log('ccks:', cookies)
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const data = yield this.request({
                opts: { proxy },
                cookiesHeaders: { cookies },
                pathLoader: () => ({
                    args: [sellerId, categoryId, page.toString()],
                    nextUrl: categoryUrl,
                }),
            });
            // console.log(data)
            const parsed = this.process(data);
            if ("err" in parsed) {
                return {
                    err: parsed.err,
                };
            }
            return Object.assign(Object.assign({}, parsed), { cookies });
        });
    }
    fetchSubcategories(_a) {
        return __awaiter(this, arguments, void 0, function* ({ categoryId, preloadedCookies, proxy, sellerId, treeNode, categoryUrl, }) {
            var _b, _c;
            const { cookies } = yield this.getCookies({ preloadedCookies, proxy });
            if (!cookies) {
                throw new Error("could not fetch cookies");
            }
            const data = yield this.request({
                opts: { proxy },
                cookiesHeaders: { cookies },
                pathLoader: () => ({
                    args: [sellerId, categoryId],
                    nextUrl: categoryUrl,
                }),
            });
            if (!treeNode) {
                treeNode = {
                    url: "",
                    title: "",
                    children: [],
                    isRoot: true,
                };
            }
            const parsed = this.processSubcategories(data, treeNode.isRoot);
            if (parsed.root) {
                treeNode.title = parsed.root.title;
                treeNode.url = parsed.root.url;
            }
            for (const node of (_b = parsed.children) !== null && _b !== void 0 ? _b : []) {
                (_c = treeNode.children) === null || _c === void 0 ? void 0 : _c.push(node);
                yield sleeper(4000);
                yield this.fetchSubcategories({
                    categoryUrl: node.url,
                    preloadedCookies: { cookies },
                    proxy,
                    treeNode: node,
                    sellerId,
                    categoryId: "",
                });
            }
            return treeNode;
        });
    }
    getPath({ args, nextUrl }) {
        if (nextUrl) {
            return encodeURIComponent(nextUrl);
        }
        const pagePart = args[2]
            ? +args[2] > 1
                ? `?layout_container=categorySearchMegapagination&layout_page_index=${args[1]}&page=${args[1]}`
                : ""
            : "";
        const categoryPart = args[1] ? `${args[1]}/` : "";
        return encodeURIComponent(`/seller/${args[0]}/${categoryPart}?miniapp=seller_${args[0]}${pagePart}`);
    }
    processSubcategories(data, root = false) {
        var _a, _b, _c;
        const errChecker = this.checkError(data);
        if (errChecker.err) {
            return { err: errChecker.err };
        }
        const parsed = this.stateParser(data);
        if (parsed.filtersDesktop) {
            console.log(parsed.filtersDesktop);
            const sections = flatten(parsed.filtersDesktop.sections);
            const filters = flatten(sections.map((s) => s.filters));
            const catSection = filters.find((f) => f.type === "categoryFilter");
            if (catSection) {
                let rootNode;
                const children = (_b = (_a = catSection.categoryFilter) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.filter((c) => c.level > 0).map(({ title, urlValue }) => ({
                    title,
                    url: urlValue,
                    children: [],
                }));
                if (root) {
                    const r = (_c = catSection.categoryFilter) === null || _c === void 0 ? void 0 : _c.categories.find((c) => c.level === 0);
                    if (r) {
                        rootNode = {
                            url: r.urlValue,
                            title: r.title,
                        };
                    }
                }
                return {
                    children,
                    root: rootNode,
                };
            }
            return { children: [] };
        }
        return { children: [] };
    }
}
