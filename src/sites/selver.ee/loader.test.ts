import { describe, expect, test } from "vitest";
import { generateElasticQuery } from "./settings.js";
describe("Selver.ee", () => {
  test("selver:load products", async () => {
    const d = await generateElasticQuery("vue_storefront_catalog_et")
    expect(d).toBeDefined()
  })
}, 50000)