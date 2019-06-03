import { BigNumber, Buffer, Contract, ContractMetadata, Long, Transaction } from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'
import {ContractMetadataDto} from '@app/graphql/contracts/dto/contract-metadata.dto'
import {TxDto} from '@app/graphql/txs/dto/tx.dto'

export class ContractDto implements Contract {

  address?: string;
  creator?: string;
  init?: string;
  code?: string;
  refundAddress?: string;
  refundBalance?: BigNumber;
  traceCreatedAtBlockHash?: string;
  traceCreatedAtBlockNumber?: BigNumber;
  traceCreatedAtTransactionHash?: string;
  traceCreatedAtTransactionIndex?: number;
  traceCreatedAtLogIndex?: number;
  traceCreatedAtTraceAddress?: string;
  traceDestroyedAtBlockHash?: string;
  traceDestroyedAtBlockNumber?: BigNumber;
  traceDestroyedAtTransactionHash?: string;
  traceDestroyedAtTransactionIndex?: Long;
  traceDestroyedAtLogIndex?: Long;
  traceDestroyedAtTraceAddress?: string;
  traceDestroyedAt?: Buffer;
  metadata?: ContractMetadata;
  totalSupply?: BigNumber;
  createdAtTx?: Transaction;
  timestamp?: Date;

  constructor(data) {

    if (data.metadata) {
      this.metadata = new ContractMetadataDto(data.metadata)
      delete data.metadata
    }
    if (data.erc20Metadata) {
      this.totalSupply = data.erc20Metadata.totalSupply
      delete data.erc20Metadata
    }
    if (data.createdAtTx) {
      this.createdAtTx = new TxDto(data.createdAtTx)
      delete data.createdAtTx
    }

    assignClean(this, data)
  }
}
