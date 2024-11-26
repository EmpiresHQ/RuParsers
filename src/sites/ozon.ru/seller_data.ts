import path from "path";
import * as dotenv from "dotenv";
import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { OzonSellerCategoryProcessor } from "./seller_category_processor.js";
import { proxyUrlFromType, renderer } from "../../helpers/renderer.js";
import { Fetcher } from "./base.js";
import { BaseResponseData, CategoryResponseData } from "./types.js";
import { curlFetch } from "../../helpers/curl.js";
import { ProxyType } from "../../types/index.js";

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

console.log(proxy);
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
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const processor = new OzonSellerCategoryProcessor({
    cookieLoader,
    fetcher: loader as Fetcher<CategoryResponseData>,
  });
  const parsed = await processor.fetchCategory({
    sellerId: "1456889",
    categoryId: "maslyanye-filtry-8707",
    page: 1,
    // preloadedCookies: [],
    proxy,
  });

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: "1WtCVeVS8WDVoW_uZKeTbjRdZhOQ4wwe0L9aQ89I5vHY",
    range: "Шаблон!A5",
    valueInputOption: "RAW",
    requestBody: {
      values: parsed.items?.map((i, cnt) => [
        cnt,
        `art-${cnt}`,
        i.title,
        i.discountPrice,
        i.regularPrice,
        undefined,
        i.skuId,
      ]),
    },
  });
  console.log(result);
  return sheets;
}

(async () => {
  await main();
})();
