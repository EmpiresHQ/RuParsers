/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'node:fs/promises';
import path from "path";
import * as dotenv from "dotenv";
import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { OzonSellerCategoryProcessor } from "./seller_category_processor.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { Fetcher } from "./base.js";
import {
  BaseResponseData,
  CategoryResponseData,
  CharacteristicsOutput,
  ResponseOzonItem,
} from "./types.js";
import { curlFetch } from "../../helpers/curl.js";
import { ProxyType, SimpleCookie } from "../../types/index.js";
import { sleeper } from "../../helpers/sleeper.js";
import { decode } from 'html-entities';
import { OzonItemMetaProcessor } from './item_meta_processor.js';

const __dirname = import.meta.dirname;

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// const TOKEN_PATH = path.join(import.meta.dirname, "..", "..", "token.json");
const CREDENTIALS_PATH = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "credentials2.json"
);
dotenv.config();

const proxy: ProxyType = {
  url: process.env.TEST_OZON_PROXY_URL ?? "",
  auth: process.env.TEST_OZON_PROXY_AUTH ?? "",
};

const cookieLoader = async () => {
  const proxyUrl = proxyUrlFromType(proxy);
  const res = await renderer({
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
  return (res.cookies ?? []).map(({ name, value }) => ({ name, value }));
};

const loader: Fetcher<BaseResponseData | CategoryResponseData> = async (
  opts
) => {
  opts.headers = [
    "Content-Type: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    `Sec-Fetch-Dest: document`,
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: cross-site",
    `Sec-ch-ua-platform: "Linux"`,
  ];
  const data = await curlFetch({ ...opts, version: "V2Tls" }, "json");
  return data as BaseResponseData | CategoryResponseData;
};

async function main(): Promise<sheets_v4.Sheets> {
  console.log(CREDENTIALS_PATH);
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  // @ts-ignore
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const processor = new OzonSellerCategoryProcessor({
    cookieLoader,
    fetcher: loader as Fetcher<CategoryResponseData>,
  });

  const itemMetaProcessor = new OzonItemMetaProcessor({
    cookieLoader,
    fetcher: loader
  })

  let parsed: ResponseOzonItem[] = [];

  const recursive = async ({
    page = 1,
    categoryUrl,
    cookies,
  }: {
    page?: number;
    categoryUrl?: string;
    cookies?: SimpleCookie[];
  }) => {
    console.log("fetching page: ", page);
    const data = await processor.fetchCategory({
      sellerId: "1456889",
      categoryId: "maslyanye-filtry-8707",
      categoryUrl,
      page,
      preloadedCookies: cookies,
      proxy,
    });
    if (data.items) {
      for (const item of data.items) {
        console.log('fetching meta for: ', item.skuId)
        const metaData = await itemMetaProcessor.fetchItem({
          itemId: item.skuId,
          preloadedCookies: data.cookies,
          proxy,
        })
        if (metaData.characteristics) {
          item.filters = metaData.characteristics
        }
        await sleeper(4000);
      }
      parsed.push(...data.items);
    }
    if (data.hasNextPage) {
      await sleeper(4000);
      await recursive({
        page: page + 1,
        categoryUrl: data.nextPage,
        cookies: data.cookies,
      });
    }
  };

  const fpath = path.join(__dirname, "dump.json")
  let fexists = false;
  try {
    await fs.stat(fpath)
    fexists = true
  }
  catch (e) {
    fexists = false
  }
  if (fexists) {
    const fdata = await fs.readFile(fpath)
    parsed = JSON.parse(fdata.toString()) as ResponseOzonItem[]
  } else {
    await recursive({});
    fs.writeFile(fpath, JSON.stringify(parsed));
  }

  const filterValue = (filters: CharacteristicsOutput[]= [], key: string) => filters.find(f => f.key === key)?.text

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: "1WtCVeVS8WDVoW_uZKeTbjRdZhOQ4wwe0L9aQ89I5vHY",
    range: "Шаблон!A5",
    valueInputOption: "RAW",
    requestBody: {
      values: parsed.map((i, cnt) => [
        cnt+1,
        filterValue(i.filters, 'Type_0'),
        decode(i.title),
        i.discountPrice?.substring(0, i.discountPrice.indexOf("₽")-1),
        i.regularPrice.substring(0, i.regularPrice.indexOf("₽")-1),
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
      ]),
    },
  });
  console.log(result);
  return sheets;
}

(async () => {
  await main();
})();
