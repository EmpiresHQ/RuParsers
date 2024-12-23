// images/c246x328/1.webp
// images/big/2.webp
export const wb_img_url = (nm, imgPart = "/images/c246x328/1.webp") => {
    const vol = ~~(nm / 1e5);
    const part = ~~(nm / 1e3);
    let host = "https://";
    if (vol >= 0 && vol <= 143) {
        host += "basket-01.wb.ru";
    }
    else if (vol >= 144 && vol <= 287) {
        host += "basket-02.wb.ru";
    }
    else if (vol >= 288 && vol <= 431) {
        host += "basket-03.wb.ru";
    }
    else if (vol >= 432 && vol <= 719) {
        host += "basket-04.wb.ru";
    }
    else if (vol >= 720 && vol <= 1007) {
        host += "basket-05.wb.ru";
    }
    else if (vol >= 1008 && vol <= 1061) {
        host += "basket-06.wb.ru";
    }
    else if (vol >= 1062 && vol <= 1115) {
        host += "basket-07.wb.ru";
    }
    else if (vol >= 1116 && vol <= 1169) {
        host += "basket-08.wb.ru";
    }
    else if (vol >= 1170 && vol <= 1313) {
        host += "basket-09.wb.ru";
    }
    else if (vol >= 1314 && vol <= 1601) {
        host += "basket-10.wb.ru";
    }
    else if (vol >= 1602 && vol <= 1655) {
        host += "basket-11.wb.ru";
    }
    else if (vol >= 1656 && vol <= 1919) {
        host += "basket-12.wb.ru";
    }
    else if (vol >= 1920 && vol <= 2045) {
        host += "basket-13.wb.ru";
    }
    else if (vol >= 2045 && vol <= 2189) {
        host += "basket-14.wb.ru";
    }
    else if (vol >= 2189 && vol <= 2405) {
        host += "basket-15.wbbasket.ru";
    }
    else if (vol >= 2405 && vol <= 2621) {
        host += "basket-16.wbbasket.ru";
    }
    else {
        host += "basket-17.wbbasket.ru";
    }
    return `${host}/vol${vol}/part${part}/${nm}${imgPart}`;
};
export const categoryProcessor = (data) => {
    var _a;
    if (!data ||
        !data.data ||
        !data.data.products ||
        !data.data.products.length) {
        return {
            err: undefined,
            hasNextPage: false,
        };
    }
    const items = ((_a = data.data.products) !== null && _a !== void 0 ? _a : []).map(({ id, name, salePriceU, priceU }) => ({
        skuId: id.toString(),
        title: name,
        discountPrice: salePriceU.toString(),
        regularPrice: priceU.toString(),
        imageUrl: wb_img_url(id),
    }));
    return {
        items,
        hasNextPage: true,
    };
};
