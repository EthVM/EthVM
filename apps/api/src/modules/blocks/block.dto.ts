import { Block } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class BlockDto extends Block {
  constructor(data: any) {
    super()
    if (data.header && !data.header.number) {
      data.header.number = 0 // Ensure "undefined" returned from mongo is treated as 0
    }
    assignClean(this, data)
  }
}
