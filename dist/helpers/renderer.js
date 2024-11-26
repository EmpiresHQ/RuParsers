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
export const proxyUrlFromType = ({ url, auth }) => {
    const urlObj = new URL(url);
    if (auth) {
        const [username, password] = auth.split(":");
        urlObj.username = username;
        urlObj.password = password;
    }
    return urlObj.toString();
};
export const renderer = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.PARSERS_URL) {
        throw new Error("no parsers url");
    }
    const data = yield fetch(`${process.env.PARSERS_URL}/process`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(params)
    });
    const res = yield data.json();
    return res;
});
