import { describe, expect, test } from "vitest";
import { HOST, restRequestOpts } from "./settings.js";

import { curlFetch } from "../../helpers/curl.js";
import { jsParser } from "./category_parser.js";
import { Category } from "./index.js";
import { treeParser } from "./category_tree.js";

describe("Barbora.ee", () => {
  test("barbora:load products", async () => {
    const data = restRequestOpts(
      {
        data: {
          text: "piimatooted-ja-munad",
          remoteId: "-1",
        },
      },
      1
    );
    console.log(data);
    expect(data).toBeDefined();
    const reply = await curlFetch(
      {
        ...data,
        url: `${HOST}${data.urlPath}`,
        proxy: {
          url: process.env.TEST_PROXY_URL ?? "",
          auth: process.env.TEST_PROXY_AUTH,
        },
      },
      "text"
    );
    expect(reply).toBeDefined();
    // console.log(JSON.stringify(reply, null, 2));
    const parsed = await jsParser({ html: Buffer.from(reply as ArrayBuffer) });
    expect(parsed).toBeDefined();
    // console.log(JSON.stringify(parsed, null, 2));
  });
  test("barbora:load categories", async () => {
    const loader = async (url: string) => {
      console.log(url)
      const data = await curlFetch({
        url,
        method: "GET",
        proxy: {
          url: process.env.TEST_PROXY_URL ?? "",
          auth: process.env.TEST_PROXY_AUTH,
        },
      }, 'json');
      console.log(data)
      return data as Category[];
    };

    const categories = await treeParser({ loader });
    console.log(categories)
    expect(categories).toBeDefined()
  });
}, 50000);
