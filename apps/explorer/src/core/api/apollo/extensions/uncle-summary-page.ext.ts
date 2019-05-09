import BigNumber from 'bignumber.js'
import { UncleSummaryPage, UncleSummaryPage_items } from '@app/core/api/apollo/types/UncleSummaryPage'
import { EthValue } from '@app/core/models'

export class UncleSummaryPageExt_items implements UncleSummaryPage_items {
  __typename!: "Uncle"
  author: string
  hash: string
  nephewNumber: any
  number: any
  uncleIndex: number
  uncleReward: any

  constructor(proto: UncleSummaryPage_items) {
    this.author = proto.author
    this.hash = proto.hash
    this.nephewNumber = proto.nephewNumber
    this.number = proto.number
    this.uncleIndex = proto.uncleIndex
    this.uncleReward = proto.uncleReward
  }

  get nephewNumberBN(): BigNumber {
    return new BigNumber(this.nephewNumber)
  }

  get numberBN(): BigNumber {
    return new BigNumber(this.number)
  }

  get uncleRewardBN(): BigNumber {
    return new BigNumber(this.uncleReward)
  }

  get uncleRewardEth(): EthValue {
    return new EthValue(this.uncleRewardBN)
  }
}

export class UncleSummaryPageExt implements UncleSummaryPage {
  __typename!: "UnclePage"
  items: UncleSummaryPage_items[]
  totalCount: number

  constructor(proto: UncleSummaryPage) {
    this.items = proto.items.map(i => new UncleSummaryPageExt_items(i))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BigNumber {
    return new BigNumber(this.totalCount)
  }
}
