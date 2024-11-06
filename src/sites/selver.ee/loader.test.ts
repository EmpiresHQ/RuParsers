import { describe, expect, test } from "vitest";
import { apiRequestOpts } from "./settings.js";
import { fetcher } from "./fetcher.js";
import * as dotenv from "dotenv";
import { treeParser } from "./category_tree.js";
import { apiParser } from "./category_parser.js";
dotenv.config();

describe("Selver.ee", () => {
  test("selver:load products", async () => {
    const opts = await apiRequestOpts({
      data: {
        remoteId: "210",
        text: "210",
      },
    });
    opts.proxy = {
      url: process.env.TEST_PROXY_URL ?? "",
      auth: process.env.TEST_PROXY_AUTH,
    };
    const data = await fetcher(opts);
    if ("error" in data) {
      console.log(data.error);
    } else {
      console.log(
        JSON.stringify(
          data.map((p) => p._source.url_path),
          null,
          2
        )
      );
    }
    apiParser({json: data})

    expect(data).toBeDefined();
  });
  test("selver:load categories", async () => {
    const cats = await treeParser({
      proxy: {
        url: process.env.TEST_PROXY_URL ?? "",
        auth: process.env.TEST_PROXY_AUTH,
      },
    });

    expect(cats).toBeDefined();
  });
}, 50000);
