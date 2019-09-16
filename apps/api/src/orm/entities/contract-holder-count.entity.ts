import {Entity, PrimaryColumn} from 'typeorm'
import {GenericCountEntity} from '@app/orm/abstract-entities/generic-count.entity';

@Entity('contract_holder_count')
export class ContractHolderCountEntity extends GenericCountEntity {

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  contractAddress!: string

  @PrimaryColumn({ type: 'varchar', length: 32, readonly: true })
  tokenType!: string

}
