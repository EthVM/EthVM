import { Token } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenDto extends Token {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
