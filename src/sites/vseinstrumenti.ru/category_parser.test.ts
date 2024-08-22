import { assert, beforeAll, beforeEach, describe, expect, test } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { categoryJSParser, categoryParser } from "./index.js";

describe("Vseinstrumenti.ru category parser", () => {
  const __dirname = import.meta.dirname;
  let data: Buffer;
  beforeAll(() => {
    data = fs.readFileSync(path.join(__dirname, "fixtures", "category.html"));
  });
  test("load js", () => {
    const parsed = categoryJSParser(data);
    expect(parsed[0].regularPrice).toBe("24970");
    expect(parsed[0].stock).toBe(330);
  });
  test("load html", () => {
    const parsed = categoryParser(data);
    expect(parsed[0].regularPrice).toBe("24 970 р.");
    expect(parsed[0].stock).toBe(Infinity);
  });
});
