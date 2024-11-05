import { describe, expect, test } from "vitest";
import * as dotenv from "dotenv";
import { CatResponse } from "./types.js";
import { treeLoader } from "./category_tree.js";
import { renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";

dotenv.config();
describe("DNS", () => {
  test("dns:load products", async () => {
    const cats = await treeLoader({
      preloader: async (args) => {
        if (args.antibotOpts) {
          return renderer(args.antibotOpts);
        }
        return {cookies: []}
      },
      loader: async (rp, cookies) => {
        const data = await curlFetch<CatResponse>({...rp, cookies})
        return data
      }
    });
    expect(cats).toBeDefined()
  });
}, 5000000);
