import {TransactionSummary} from '@app/graphql/schema';
import {assignClean} from '@app/shared/utils';

export class TransactionSummaryDto extends TransactionSummary {

  constructor(data: any) {
    super();
    assignClean(this, data)
  }

}
