var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dotenv from "dotenv";
dotenv.config();
export const curlFetch = (params_1, ...args_1) => __awaiter(void 0, [params_1, ...args_1], void 0, function* (params, load = "json") {
    if (!process.env.CURL_URL) {
        throw new Error("not curl url");
    }
    const data = yield fetch(process.env.CURL_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(params),
    });
    switch (load) {
        case 'text':
            return data.text();
        case 'json':
            return data.json();
        default:
            return data.arrayBuffer();
    }
});
