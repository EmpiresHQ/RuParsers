var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const API_HOST = "https://www.selver.ee/api/catalog/";
export const MEDIA_HOST = "https://www.selver.ee/img/800/800/resize";
export const apiRequestOpts = (handler_1, ...args_1) => __awaiter(void 0, [handler_1, ...args_1], void 0, function* (handler, page = 0) {
    var _a;
    return ({
        urlPath: "",
        method: "GET",
        host: API_HOST,
        remoteCategoryId: (_a = handler.data.remoteId) !== null && _a !== void 0 ? _a : "1",
        page,
    });
});
