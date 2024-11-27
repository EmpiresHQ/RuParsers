var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'node:fs/promises';
import path from "path";
import * as dotenv from "dotenv";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { OzonSellerCategoryProcessor } from "./seller_category_processor.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";
import { sleeper } from "../../helpers/sleeper.js";
import { decode } from 'html-entities';
import { OzonItemMetaProcessor } from './item_meta_processor.js';
const __dirname = import.meta.dirname;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// const TOKEN_PATH = path.join(import.meta.dirname, "..", "..", "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "..", "..", "..", "credentials2.json");
dotenv.config();
const proxy = {
    url: (_a = process.env.TEST_OZON_PROXY_URL) !== null && _a !== void 0 ? _a : "",
    auth: (_b = process.env.TEST_OZON_PROXY_AUTH) !== null && _b !== void 0 ? _b : "",
};
const cookieLoader = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const proxyUrl = proxyUrlFromType(proxy);
    const res = yield renderer({
        url: `https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=${encodeURIComponent(`/product/1428983821`)})`,
        waitAfterLoad: 4000,
        getDocumentBody: true,
        fetchCookies: {
            domains: ["https://www.ozon.ru"],
            cookieNames: ["abt_data", "__Secure-ETC"],
        },
        proxy: {
            url: proxyUrl,
        },
    });
    return ((_a = res.cookies) !== null && _a !== void 0 ? _a : []).map(({ name, value }) => ({ name, value }));
});
const loader = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    opts.headers = [
        "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        `Sec-Fetch-Dest: document`,
        "Sec-Fetch-Mode: navigate",
        "Sec-Fetch-Site: cross-site",
        `Sec-ch-ua-platform: "Linux"`,
    ];
    const data = yield curlFetch(Object.assign(Object.assign({}, opts), { version: "V2Tls" }), "json");
    return data;
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(CREDENTIALS_PATH);
        const auth = new GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: SCOPES,
        });
        const authClient = yield auth.getClient();
        // @ts-ignore
        const sheets = google.sheets({ version: "v4", auth: authClient });
        const processor = new OzonSellerCategoryProcessor({
            cookieLoader,
            fetcher: loader,
        });
        const itemMetaProcessor = new OzonItemMetaProcessor({
            cookieLoader,
            fetcher: loader
        });
        let parsed = [];
        const recursive = (_a) => __awaiter(this, [_a], void 0, function* ({ page = 1, categoryUrl, cookies, }) {
            console.log("fetching page: ", page);
            const data = yield processor.fetchCategory({
                sellerId: "1456889",
                categoryId: "maslyanye-filtry-8707",
                categoryUrl,
                page,
                preloadedCookies: cookies,
                proxy,
            });
            if (data.items) {
                for (const item of data.items) {
                    console.log('fetching meta for: ', item.skuId);
                    const metaData = yield itemMetaProcessor.fetchItem({
                        itemId: item.skuId,
                        preloadedCookies: data.cookies,
                        proxy,
                    });
                    if (metaData.characteristics) {
                        item.filters = metaData.characteristics;
                    }
                    yield sleeper(4000);
                }
                parsed.push(...data.items);
            }
            if (data.hasNextPage) {
                yield sleeper(4000);
                yield recursive({
                    page: page + 1,
                    categoryUrl: data.nextPage,
                    cookies: data.cookies,
                });
            }
        });
        const fpath = path.join(__dirname, "dump.json");
        let fexists = false;
        try {
            yield fs.stat(fpath);
            fexists = true;
        }
        catch (e) {
            fexists = false;
        }
        if (fexists) {
            const fdata = yield fs.readFile(fpath);
            parsed = JSON.parse(fdata.toString());
        }
        else {
            yield recursive({});
            fs.writeFile(fpath, JSON.stringify(parsed));
        }
        const filterValue = (filters = [], key) => { var _a; return (_a = filters.find(f => f.key === key)) === null || _a === void 0 ? void 0 : _a.text; };
        const result = yield sheets.spreadsheets.values.append({
            spreadsheetId: "1WtCVeVS8WDVoW_uZKeTbjRdZhOQ4wwe0L9aQ89I5vHY",
            range: "Шаблон!A5",
            valueInputOption: "RAW",
            requestBody: {
                values: parsed.map((i, cnt) => {
                    var _a;
                    return [
                        cnt + 1,
                        filterValue(i.filters, 'Type_0'),
                        decode(i.title),
                        (_a = i.discountPrice) === null || _a === void 0 ? void 0 : _a.substring(0, i.discountPrice.indexOf("₽") - 1),
                        i.regularPrice.substring(0, i.regularPrice.indexOf("₽") - 1),
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        filterValue(i.filters, 'Width_0'),
                        filterValue(i.filters, 'Height_0'),
                        filterValue(i.filters, 'length_0'),
                        i.imageUrl,
                        undefined,
                        undefined,
                        undefined,
                        filterValue(i.filters, 'Brand_0'),
                        undefined,
                        filterValue(i.filters, 'QuantityUOM_0'),
                        filterValue(i.filters, 'Type_0'),
                        filterValue(i.filters, 'Код продавца'),
                        filterValue(i.filters, 'AltArticle_0'),
                        undefined,
                        undefined,
                        undefined,
                        filterValue(i.filters, 'OEMNum_0'),
                        filterValue(i.filters, 'AltArticle_0'),
                        filterValue(i.filters, 'FilterOpt_0'),
                        filterValue(i.filters, 'FilterForm_0'),
                        filterValue(i.filters, 'FilterBox_0'),
                        undefined,
                        filterValue(i.filters, 'Width_0'),
                        filterValue(i.filters, 'Height_0'),
                        filterValue(i.filters, 'length_0'),
                        filterValue(i.filters, 'Material_Auto_0'),
                        filterValue(i.filters, 'Diametr_0'),
                        filterValue(i.filters, 'VehicleKind_0'),
                        filterValue(i.filters, 'Country_0'),
                    ];
                }),
            },
        });
        console.log(result);
        return sheets;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
}))();
