import { BlockHeaderRecord } from '@app/models/block-header-record'
import { TxRecord } from '@app/models/tx-record'
import { TxReceiptRecord } from '@app/models/tx-receipt-record'


export class BlockRecord {

  header: BlockHeaderRecord;
  transactions: TxRecord[];
  transactionReceipts: TxReceiptRecord[];

  unclesHash: Buffer;
  totalDifficulty: Buffer;



  constructor(props) {
    Object.assign(this, props);

    this.header = new BlockHeaderRecord(props.header);
  }

}
