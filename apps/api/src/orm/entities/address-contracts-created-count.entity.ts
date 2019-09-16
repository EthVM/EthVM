import {Entity, PrimaryColumn} from 'typeorm'
import {GenericCountEntity} from '@app/orm/abstract-entities/generic-count.entity';

@Entity('address_contracts_created_count')
export class AddressContractsCreatedCountEntity extends GenericCountEntity {

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

}
