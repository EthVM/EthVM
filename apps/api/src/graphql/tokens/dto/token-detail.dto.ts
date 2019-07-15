import { TokenDetail } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import { ContractLogoDto } from '@app/graphql/contracts/dto/contract-logo.dto'
import { ContractSocialDto } from '@app/graphql/contracts/dto/contract-social.dto'
import { ContractSupportDto } from '@app/graphql/contracts/dto/contract-support.dto'
import { TokenDetailEntity } from '@app/orm/entities/token-detail.entity'

export class TokenDetailDto implements TokenDetail {

  address!: string
  circulatingSupply?: BigNumber
  contractType?: string
  creator?: string
  currentPrice?: BigNumber
  decimals?: number
  holdersCount?: number
  image?: string
  logo?: ContractLogoDto
  marketCap?: BigNumber
  name?: string
  priceChangePercentage24h?: BigNumber
  social?: ContractSocialDto
  support?: ContractSupportDto
  symbol?: string
  totalSupply?: BigNumber
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
  }
}
