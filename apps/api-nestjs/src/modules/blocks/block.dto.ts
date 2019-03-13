import { Block } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class BlockDto extends Block {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
