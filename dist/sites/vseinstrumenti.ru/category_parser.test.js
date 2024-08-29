var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { beforeAll, describe, expect, test } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { jsParser, htmlParser } from "./index.js";
describe("Vseinstrumenti.ru category parser", () => {
    const __dirname = import.meta.dirname;
    let data;
    beforeAll(() => {
        data = fs.readFileSync(path.join(__dirname, "fixtures", "category.html"));
    });
    test("load js", () => __awaiter(void 0, void 0, void 0, function* () {
        const parsed = yield jsParser(data);
        if (parsed && parsed.items) {
            expect(parsed.items[0].regularPrice).toBe("24970");
            expect(parsed.items[0].stock).toBe(330);
        }
        console.log(parsed.hasNextPage);
    }));
    test("load html", () => __awaiter(void 0, void 0, void 0, function* () {
        const parsed = yield htmlParser(data);
        if (parsed && parsed.items) {
            expect(parsed.items[0].regularPrice).toBe("24 970 р.");
            expect(parsed.items[0].stock).toBe(Infinity);
        }
    }));
});
