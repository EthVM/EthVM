import { Uncle, UnclePage } from '@app/graphql/schema'
import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { UncleDto } from '@app/graphql/uncles/dto/uncle.dto'

export class UnclePageDto implements UnclePage {

  items: UncleDto[];
  totalCount: number;

  constructor(items: UncleEntity[], totalCount: number) {
    this.totalCount = totalCount
    this.items = items.map(i => new UncleDto(i))
  }

}
