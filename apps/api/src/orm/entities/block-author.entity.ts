import { Column, Entity } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_block_author')
export class BlockAuthorEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @Column({type: 'character', length: 66, readonly: true})
  address?: string

  @Column({type: 'bigint', readonly: true})
  count?: string

}
