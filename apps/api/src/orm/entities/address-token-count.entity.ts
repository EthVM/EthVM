import {Entity, PrimaryColumn} from 'typeorm'
import {GenericCountEntity} from '@app/orm/abstract-entities/generic-count.entity';

@Entity('address_token_count')
export class AddressTokenCountEntity extends GenericCountEntity {

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'varchar', length: 32, readonly: true })
  tokenType!: string

}
