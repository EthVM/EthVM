import {UnclePage} from '@app/graphql/schema'
import {UncleDto} from '@app/graphql/uncles/dto/uncle.dto'
import {UncleEntity} from '@app/orm/entities/uncle.entity';
import BigNumber from 'bignumber.js';

export class UnclePageDto implements UnclePage {

  items: UncleDto[];
  totalCount: BigNumber;

  constructor(items: UncleEntity[], totalCount: BigNumber) {
    this.totalCount = totalCount
    this.items = items.map(i => new UncleDto(i))
  }

}
