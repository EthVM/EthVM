import {Contract} from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'
import {ContractMetadataDto} from '@app/graphql/contracts/dto/contract-metadata.dto'
import {TxDto} from '@app/graphql/txs/dto/tx.dto'

export class ContractDto extends Contract {
  constructor(data) {
    super()

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
