import { ConfigService } from '@app/shared/config.service'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { FindManyOptions, Repository } from 'typeorm'
import { TokenDto } from '@app/modules/tokens/dto/token.dto'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { QuoteDto } from '@app/modules/tokens/dto/quote.dto'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(Erc721BalanceEntity)
    private readonly erc721BalanceRepository: Repository<Erc721BalanceEntity>,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findTokenHolders(address: string, limit: number = 10, page: number = 0): Promise<Erc20BalanceEntity[] | Erc721BalanceEntity[]> {
    const skip = page * limit
    const findOptions: FindManyOptions = {
      where: { contract: address },
      take: limit,
      skip,
    }
    const ercBalances = await this.erc20BalanceRepository.find(findOptions)
    if (ercBalances.length) {
      return ercBalances
    }
    return await this.erc721BalanceRepository.find(findOptions)
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {
    const where = { contract: tokenAddress, address: holderAddress }
    const erc20Balance = await this.erc20BalanceRepository.findOne({ where })
    if (erc20Balance) return erc20Balance
    return this.erc721BalanceRepository.findOne({ where })

  }

  async findAddressAllTokensOwned(address: string): Promise<TokenDto[]> {
    const findOptions: FindManyOptions = { where: { address }, relations: ['tokenExchangeRate', 'metadata'] }
    const erc20Tokens = await this.erc20BalanceRepository.find(findOptions)
    const erc721Tokens = await this.erc721BalanceRepository.find(findOptions)

    const tokenDtos: TokenDto[] = []

    erc20Tokens.forEach(entity => {
      tokenDtos.push(this.constructTokenDto(entity))
    })
    erc721Tokens.forEach(entity => {
      tokenDtos.push(this.constructTokenDto(entity))
    })

    return tokenDtos
  }

  private constructTokenDto(entity: Erc20BalanceEntity | Erc721BalanceEntity): TokenDto {
    const { tokenExchangeRate, metadata } = entity
    const tokenData = metadata || {} as any
    if (entity instanceof Erc20BalanceEntity) { tokenData.balance = entity.amount }
    if (tokenExchangeRate) { tokenData.currentPrice = tokenExchangeRate.currentPrice }
    return new TokenDto(tokenData)
  }

  async findQuote(token: string, to: string): Promise<QuoteDto> {
    const url = this.configService.coinGecko.url

    const res = await axios.get(url)

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { ethereum } = res.data

    return new QuoteDto({
      to,
      price: ethereum.usd,
      vol_24h: ethereum.usd_24h_vol,
      last_update: ethereum.last_updated_at,
    })
  }

  async findTokenExchangeRates(sort: string, take: number = 10, page: number = 0): Promise<TokenExchangeRateEntity[]> {
    const skip = take * page
    let order
    switch (sort) {
      case 'price_high':
        order = { currentPrice: -1 }
        break
      case 'price_low':
        order = { currentPrice: 1 }
        break
      case 'volume_high':
        order = { totalVolume: -1 }
        break
      case 'volume_low':
        order = { totalVolume: 1 }
        break
      case 'market_cap_high':
        order = { marketCap: -1 }
        break
      case 'market_cap_low':
        order = { marketCap: 1 }
        break
      case 'market_cap_rank':
      default:
        order = { marketCapRank: 1 }
        break
    }
    return this.tokenExchangeRateRepository.find({ order, skip, take })
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count()
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({ where: { symbol } })
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({ where: { address } })
  }

  async findContractInfoForToken(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({ where: { address }, select: ['address', 'creator'] })
  }

  async countTokenHolders(address: string): Promise<number> {
    let numHolders = await this.erc20BalanceRepository.count({ where: { contract: address }})
    if (!numHolders || numHolders === 0) {
      numHolders = await this.erc721BalanceRepository.count({ where: { contract: address }})
    }
    return numHolders
  }

  async countTokensByHolderAddress(address: string): Promise<number> {
    const numErc20Tokens = await this.erc20BalanceRepository.count({ where: { address } })
    const numErc721Tokens = await this.erc721BalanceRepository.count({ where: { address }})
    return numErc20Tokens + numErc721Tokens
  }
}
