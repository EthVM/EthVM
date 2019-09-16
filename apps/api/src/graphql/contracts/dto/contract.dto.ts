import {BigNumber, Contract, ContractMetadata, Transaction} from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'
import {TxDto} from '@app/graphql/txs/dto/tx.dto'
import {EthListContractMetadataDto} from '@app/graphql/contracts/dto/eth-list-contract-metadata.dto';

export class ContractDto implements Contract {

  address?: string;
  creator?: string;
  init?: string;
  code?: string;
  refundAddress?: string;
  refundBalance?: BigNumber;
  createdAtBlockHash?: string;
  createdAtBlockNumber?: BigNumber;
  createdAtTransactionHash?: string;
  createdAtTraceAddress?: string;
  destroyedAtBlockHash?: string;
  destroyedAtBlockNumber?: BigNumber;
  destroyedAtTransactionHash?: string;
  destroyedAtTraceAddress?: string;
  ethListContractMetadata?: ContractMetadata;
  totalSupply?: BigNumber;

  constructor(data) {

    if (data.ethListContractMetadata) {
      this.ethListContractMetadata = new EthListContractMetadataDto(data.metadata)
      delete data.metadata
    }
    if (data.contractMetadata) { // TODO determine if we can get more data here
      this.totalSupply = data.contractMetadata.totalSupply
      delete data.contractMetadata
    }

    assignClean(this, data)
  }
}
