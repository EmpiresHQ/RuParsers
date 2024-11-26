import { OzonItemProcessor } from "./item_processor.js";
import { CharacteristicsOutput, BaseResponseData } from "./types.js";
export declare class OzonItemMetaProcessor extends OzonItemProcessor {
    getPath({ args }: {
        args: string[];
    }): string;
    process(data: BaseResponseData): {
        err?: unknown;
        characteristics?: CharacteristicsOutput[];
    };
    filterStates(): string[];
}
//# sourceMappingURL=item_meta_processor.d.ts.map