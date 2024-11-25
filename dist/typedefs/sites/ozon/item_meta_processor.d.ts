import { OzonItemProcessor } from "./item_processor.js";
import { CharacteristicsOutput, ItemResponseData } from "./types.js";
export declare class OzonItemMetaProcessor extends OzonItemProcessor {
    getPath(itemId: string): string;
    process(data: ItemResponseData): {
        err?: unknown;
        item?: CharacteristicsOutput[];
    };
    filterStates(): string[];
}
//# sourceMappingURL=item_meta_processor.d.ts.map