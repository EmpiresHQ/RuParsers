export const categoryItemsParser = ({ items }) => items.map(({ mainState, rightState, tileImage, skuId }) => {
    const dict = [...mainState, ...(rightState !== null && rightState !== void 0 ? rightState : [])].reduce((sum, n) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // console.log("img: ", tileImage);
        switch (n.atom.type) {
            case "priceV2":
                sum[n.atom.type] = Object.assign(Object.assign({}, ((_a = sum[n.atom.type]) !== null && _a !== void 0 ? _a : {
                    regular_price: undefined,
                    discount_price: undefined,
                })), {
                    regular_price: (_b = (n.atom.priceV2.price[1] && n.atom.priceV2.price[1].text)) !== null && _b !== void 0 ? _b : "",
                    discount_price: (_c = (n.atom.priceV2.price[0] && n.atom.priceV2.price[0].text)) !== null && _c !== void 0 ? _c : "",
                });
                break;
            case "stockBar":
                sum[n.atom.type] = (_d = n.atom.stockBar) === null || _d === void 0 ? void 0 : _d.text;
                break;
            case "labelList":
                if (((_f = (_e = n.atom.labelList) === null || _e === void 0 ? void 0 : _e.items) !== null && _f !== void 0 ? _f : []).length > 1) {
                    sum[n.atom.type] = {
                        rank: (_g = n.atom.labelList) === null || _g === void 0 ? void 0 : _g.items[0].title,
                        count: (_h = n.atom.labelList) === null || _h === void 0 ? void 0 : _h.items[1].title,
                    };
                }
                break;
            case "textAtom":
                sum[n.atom.type] = Object.assign(Object.assign(Object.assign({}, ((_j = sum[n.atom.type]) !== null && _j !== void 0 ? _j : {
                    description: undefined,
                    title: undefined,
                })), (((_l = (_k = n.atom.textAtom) === null || _k === void 0 ? void 0 : _k.maxLines) !== null && _l !== void 0 ? _l : 0) === 2
                    ? { title: (_m = n.atom.textAtom) === null || _m === void 0 ? void 0 : _m.text }
                    : {})), (((_p = (_o = n.atom.textAtom) === null || _o === void 0 ? void 0 : _o.maxLines) !== null && _p !== void 0 ? _p : 0) > 2
                    ? { description: (_q = n.atom.textAtom) === null || _q === void 0 ? void 0 : _q.text }
                    : {}));
                break;
        }
        return sum;
    }, {});
    const out = {
        skuId,
        regularPrice: "",
    };
    if (dict.priceV2) {
        const atom = dict.priceV2;
        out.regularPrice = atom.regular_price;
        out.discountPrice = atom.discount_price;
    }
    if (tileImage && tileImage.items) {
        const firstImage = tileImage.items.filter(i => i.type === 'image')[0];
        if (firstImage) {
            out.imageUrl = firstImage.image.link;
        }
    }
    if (dict.labelList) {
        out.reviews = dict.labelList;
    }
    if (dict.stockBar) {
        out.stock = dict.stockBar;
    }
    if (dict.textAtom) {
        const atom = dict.textAtom;
        out.title = atom.title;
        out.description = atom.description;
    }
    return out;
});
