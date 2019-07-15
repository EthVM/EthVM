import { TokenDetail } from '@app/graphql/schema'
import { assignClean, extractFromJson } from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import { ContractSocialDto } from '@app/graphql/contracts/dto/contract-social.dto'
import { TokenDetailEntity } from '@app/orm/entities/token-detail.entity'

export class TokenDetailDto implements TokenDetail {

  address!: string
  circulatingSupply?: BigNumber
  contractType?: string
  creator?: string
  currentPrice?: BigNumber
  decimals?: number
  holdersCount?: number
  logo?: string
  marketCap?: BigNumber
  name?: string
  priceChangePercentage24h?: BigNumber
  social?: ContractSocialDto
  email?: string
  symbol?: string
  totalSupply?: BigNumber
  totalVolume?: BigNumber
  website?: string

  constructor(data: TokenDetailEntity) {

    assignClean(this, data)

    // If data is missing, try to fill from equivalent fields

    if (!this.name) {
      this.name = data.terName || data.e20Name || data.e721Name
    }

    if (!this.symbol) {
      this.symbol = data.terSymbol || data.e20Symbol || data.e721Symbol
    }

    if (!this.decimals) {
      this.decimals = data.e20Decimals
    }

    if (!this.totalSupply) {
      this.totalSupply = data.e20TotalSupply
    }

    this.logo = extractFromJson('src', data.logo) || data.image
    this.email = extractFromJson('email', data.support)
  }
}
