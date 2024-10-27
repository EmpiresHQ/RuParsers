import { describe, expect, test } from "vitest";
import { HOST, restRequestOpts } from "./settings.js";

import { curlFetch } from "../../helpers/curl.js";
import { jsParser } from "./category_parser.js";

describe("Barbora.ee loader", () => {
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
    const parsed = await jsParser({ html: Buffer.from(reply as ArrayBuffer) });
    expect(parsed).toBeDefined()
    // console.log(JSON.stringify(parsed, null, 2));
  });
}, 50000);
