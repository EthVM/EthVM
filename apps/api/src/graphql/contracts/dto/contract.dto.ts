import {BigNumber, Contract, ContractMetadata} from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'
import {EthListContractMetadataDto} from '@app/graphql/contracts/dto/eth-list-contract-metadata.dto'
import {ContractEntity} from '@app/orm/entities/contract.entity'

export class ContractDto implements Contract {

  address?: string
  creator?: string
  init?: string
  code?: string
  refundAddress?: string
  refundBalance?: BigNumber
  createdAtBlockHash?: string
  createdAtBlockNumber?: BigNumber
  createdAtTransactionHash?: string
  createdAtTraceAddress?: string
  destroyedAtBlockHash?: string
  destroyedAtBlockNumber?: BigNumber
  destroyedAtTransactionHash?: string
  destroyedAtTraceAddress?: string
  ethListContractMetadata?: ContractMetadata
  totalSupply?: BigNumber

  constructor(data: ContractEntity) {

    if (data.ethListContractMetadata) {
      this.ethListContractMetadata = new EthListContractMetadataDto(data.ethListContractMetadata)
      delete data.ethListContractMetadata
    }
    if (data.contractMetadata) { // TODO determine if we can get more data here
      this.totalSupply = data.contractMetadata.totalSupply
      delete data.contractMetadata
    }

    assignClean(this, data)
  }
}
