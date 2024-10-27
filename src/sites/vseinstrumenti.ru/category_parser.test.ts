import { beforeAll, describe, expect, test } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { jsParser, htmlParser } from "./index.js";

describe("Vseinstrumenti.ru category parser", () => {
  const __dirname = import.meta.dirname;
  let data: Buffer;
  beforeAll(() => {
    data = fs.readFileSync(path.join(__dirname, "fixtures", "category.html"));
  });
  test("load js", async () => {
    const parsed = await jsParser({html: data});
    console.log(parsed)
    if (parsed && parsed.items) {
      expect(parsed.items[0].regularPrice).toBe("2497000");
      expect(parsed.items[0].stock).toBe(330);
    }
    console.log(parsed.hasNextPage)
  });
  test("load html", async () => {
    const parsed = await htmlParser({html: data});
    if (parsed && parsed.items) {
      expect(parsed.items[0].regularPrice).toBe("24 970 р.");
      expect(parsed.items[0].stock).toBe(Infinity);
    }
  });
});
