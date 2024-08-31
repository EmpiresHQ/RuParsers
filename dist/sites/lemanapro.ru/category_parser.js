var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _itemMapper = ({ productId, displayedName, price: { main_price }, mediaMainPhoto: { desktop }, eligibility, }) => ({
    skuId: productId,
    title: displayedName,
    regularPrice: (main_price || 0).toString(),
    imageUrl: desktop,
    isAvailable: !!(eligibility &&
        (eligibility.homeDeliveryEligible ||
            eligibility.relayPointEligible ||
            eligibility.storeDeliveryEligible ||
            eligibility.webEligible)),
});
export const apiParser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ json }) {
    if (!json) {
        throw new Error("data should not be buffer");
    }
    const items = json.content.map(_itemMapper);
    const hasNextPage = items.length > 0;
    return {
        items,
        hasNextPage,
    };
});
