import { BlockSummary } from '@app/graphql/schema';
import { assignClean } from '@app/shared/utils';

export class BlockSummaryDto extends BlockSummary {
    constructor(data: any) {
        super()
        assignClean(this, data)
    }
}
