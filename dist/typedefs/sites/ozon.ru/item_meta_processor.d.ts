import { FetchItemArgs, FetchItemResponse, OzonItemProcessor } from "./item_processor.js";
import { CharacteristicsOutput, BaseResponseData } from "./types.js";
interface FetchItemMetaResponse extends Omit<FetchItemResponse, 'item'> {
    characteristics?: CharacteristicsOutput[];
}
export declare class OzonItemMetaProcessor extends OzonItemProcessor {
    getPath({ args }: {
        args: string[];
    }): string;
    fetchItem(args: FetchItemArgs): Promise<FetchItemMetaResponse>;
    process(data: BaseResponseData): {
        characteristics?: CharacteristicsOutput[];
    } & FetchItemResponse;
    filterStates(): string[];
}
export {};
//# sourceMappingURL=item_meta_processor.d.ts.map