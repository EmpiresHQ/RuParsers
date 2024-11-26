import { AtomTypes, ResponseOzonItem, SearchResults } from "../types.js";

export const categoryItemsParser = ({ items }: SearchResults) =>
  items.map<ResponseOzonItem>(
    ({ mainState, rightState, tileImage, skuId }) => {
      const dict = [...mainState, ...(rightState ?? [])].reduce<
        Partial<{ [key in AtomTypes]: unknown }>
      >((sum, n) => {
        // console.log("img: ", tileImage);
        switch (n.atom.type) {
          case "priceV2":
            sum[n.atom.type] = {
              ...(sum[n.atom.type] ?? {
                regular_price: undefined,
                discount_price: undefined,
              }),
              ...{
                regular_price:
                  (n.atom.priceV2.price[1] && n.atom.priceV2.price[1].text) ??
                  "",
                discount_price:
                  (n.atom.priceV2.price[0] && n.atom.priceV2.price[0].text) ??
                  "",
              },
            };
            break;
          case "stockBar":
            sum[n.atom.type] = n.atom.stockBar?.text;
            break;
          case "labelList":
            if ((n.atom.labelList?.items ?? []).length > 1) {
              sum[n.atom.type] = {
                rank: n.atom.labelList?.items[0].title,
                count: n.atom.labelList?.items[1].title,
              };
            }

            break;
          case "textAtom":
            sum[n.atom.type] = {
              ...(sum[n.atom.type] ?? {
                description: undefined,
                title: undefined,
              }),
              ...((n.atom.textAtom?.maxLines ?? 0) === 2
                ? { title: n.atom.textAtom?.text }
                : {}),
              ...((n.atom.textAtom?.maxLines ?? 0) > 2
                ? { description: n.atom.textAtom?.text }
                : {}),
            };
            break;
        }
        return sum;
      }, {});
      const out: ResponseOzonItem = {
        skuId,
        regularPrice: "",
      };
      if (dict.priceV2) {
        const atom = dict.priceV2 as {
          regular_price: string;
          discount_price: string;
        };

        out.regularPrice = atom.regular_price;
        out.discountPrice = atom.discount_price;
      }
      if (tileImage && tileImage.items) {
        const firstImage = tileImage.items.filter(i => i.type === 'image')[0]
        if (firstImage) {
          out.imageUrl = firstImage.image.link;
        }
  
      }
      if (dict.labelList) {
        out.reviews = dict.labelList as { rank: string; count: string };
      }
      if (dict.stockBar) {
        out.stock = dict.stockBar as number;
      }
      if (dict.textAtom) {
        const atom = dict.textAtom as {
          description: string | undefined;
          title: string | undefined;
        };
        out.title = atom.title;
        out.description = atom.description;
      }

      return out;
    }
  );

