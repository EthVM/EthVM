import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { DateTransformer } from '@app/orm/transformers/date.transformer'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity';
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity';
import {EthListContractMetadataEntity} from '@app/orm/entities/eth-list-contract-metadata.entity';

@Entity('balance')
export class BalanceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @PrimaryColumn({ type: 'varchar', length: 42, readonly: true })
  contractAddress!: string

  @Column({ type: 'char', length: 66, readonly: true })
  blockHash!: string

  @Column({ type: 'varchar', length: 32, readonly: true })
  tokenType!: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  balance?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  tokenId?: BigNumber

  // Relations which are never loaded as relations directly
  tokenExchangeRate?: TokenExchangeRateEntity
  contractMetadata?: ContractMetadataEntity
  ethListContractMetadata?: EthListContractMetadataEntity

}
