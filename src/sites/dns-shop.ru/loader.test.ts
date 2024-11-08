import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { CatResponse } from "./types.js";
import { treeLoader } from "./category_tree.js";
import { renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";
import { API_SETTINGS, apiRequestOpts } from "./settings.js";
import { fetcher } from "./fetcher.js";
import { apiParser } from "./category_parser.js";

dotenv.config();
describe("DNS", () => {
  test("dns:load categories", async () => {
    const cats = await treeLoader({
      preloader: async (args) => {
        if (args.antibotOpts) {
          return renderer(args.antibotOpts);
        }
        return { cookies: [] };
      },
      loader: async (rp, cookies) => {
        const data = await curlFetch<CatResponse>({ ...rp, cookies });
        return data;
      },
    });
    console.log(cats)
    expect(cats).toBeDefined();
  });
  test("dns:load products", async () => {
    if (!API_SETTINGS.antibotOpts) {
      throw new Error("no bot params");
    }
    const { cookies } = await renderer(API_SETTINGS.antibotOpts);
    const opts = apiRequestOpts({
      data: {
        remoteId: "",
        text: "/catalog/17a8aa1c16404e77/wi-fi-routery/?f%5Bj%5D=9mwt&virtual_category_uid=a5f7de6c3bf03e99",
      },
    }, 1);
    const data  = await fetcher(opts, async (opts) => {
      return curlFetch({...opts, cookies})
    });
    const ready = await apiParser({json: data})
    expect(ready).toBeDefined()
    opts.page = 2
    const data2  = await fetcher(opts, async (opts) => {
      return curlFetch({...opts, cookies})
    });
    const ready2 = await apiParser({json: data2})
    console.log(ready2)
    expect(ready2).toBeDefined()
    // console.log(data.json?.assets.inlineJs)
  });
}, 5000000);
