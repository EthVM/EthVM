import {Entity, PrimaryColumn} from 'typeorm'
import {GenericCountEntity} from '@app/orm/abstract-entities/generic-count.entity';

@Entity('miner_block_count')
export class MinerBlockCountEntity extends GenericCountEntity {

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  author!: string

}
