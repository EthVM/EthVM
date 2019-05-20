
import { CoinExchangeRateEntity } from '@app/orm/entities/coin-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository, FindOneOptions, Any } from 'typeorm'
import {TokenDto} from '@app/graphql/tokens/dto/token.dto'
import {TokenMetadataDto} from '@app/graphql/tokens/dto/token-metadata.dto'
import { Token } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(Erc721BalanceEntity)
    private readonly erc721BalanceRepository: Repository<Erc721BalanceEntity>,
    @InjectRepository(Erc20MetadataEntity)
    private readonly erc20MetadataRepository: Repository<Erc20MetadataEntity>,
    @InjectRepository(Erc721MetadataEntity)
    private readonly erc721MetadataRepository: Repository<Erc721MetadataEntity>,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(CoinExchangeRateEntity)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
  ) {}

  async findTokenHolders(address: string, limit: number = 10, page: number = 0): Promise<[Erc20BalanceEntity[] | Erc721BalanceEntity[], number]> {
    const skip = page * limit
    const findOptions: FindManyOptions = {
      where: { contract: address },
      take: limit,
      skip,
    }
    const ercBalances = await this.erc20BalanceRepository.findAndCount(findOptions)
    if (ercBalances[1] > 0) {
      return ercBalances
    }
    return await this.erc721BalanceRepository.findAndCount(findOptions)
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {
    const where = { contract: tokenAddress, address: holderAddress }
    const erc20Balance = await this.erc20BalanceRepository.findOne({ where })
    if (erc20Balance) return erc20Balance
    return this.erc721BalanceRepository.findOne({ where })
  }

  async findAddressAllTokensOwned(address: string, offset: number = 0, limit: number = 10): Promise<[TokenDto[], number]> {
    const findOptions: FindManyOptions = { where: { address }, relations: ['tokenExchangeRate', 'metadata'], take: limit, skip: offset }
    const [erc20Tokens, erc20Count] = await this.erc20BalanceRepository.findAndCount(findOptions)
    const [erc721Tokens, erc721Count] = await this.erc721BalanceRepository.findAndCount(findOptions)

    const tokenDtos: TokenDto[] = []

    erc20Tokens.forEach(entity => {
      tokenDtos.push(this.constructTokenDto(entity))
    })
    erc721Tokens.forEach(entity => {
      tokenDtos.push(this.constructTokenDto(entity))
    })

    return [tokenDtos, (erc20Count + erc721Count)]
  }

  private constructTokenDto(entity: Erc20BalanceEntity | Erc721BalanceEntity): TokenDto {
    const { tokenExchangeRate, metadata } = entity
    const tokenData = metadata || ({} as any)
    if (entity instanceof Erc20BalanceEntity) {
      tokenData.balance = entity.amount
    }
    if (tokenExchangeRate) {
      tokenData.currentPrice = tokenExchangeRate.currentPrice
    }
    return new TokenDto(tokenData)
  }

  private constructTokenMetadataDto(entity: Erc20MetadataEntity | Erc721MetadataEntity): TokenMetadataDto {

    const decimals = entity instanceof Erc20MetadataEntity ? entity.decimals : null
    const { contractMetadata } = entity
    const support = contractMetadata ? contractMetadata.support : null
    const logo = contractMetadata ? contractMetadata.logo : null

    const data = {
      name: entity.name,
      address: entity.address,
      symbol: entity.symbol,
      decimals,
      website: contractMetadata ? contractMetadata.website : null,
      email: support ? JSON.parse(support).email : null,
      logo: logo ? JSON.parse(logo).src : null,
    }

    return new TokenMetadataDto(data)
  }

  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: { id: pair },
    }
    return this.coinExchangeRateRepository.findOne(findOptions)
  }

  async findTokenExchangeRates(sort: string, take: number = 10, page: number = 0, symbols: string[] = []): Promise<TokenExchangeRateEntity[]> {
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
    const where = symbols.length > 0 ? { symbol: Any(symbols) } : {}
    const findOptions: FindManyOptions = {
      where,
      order,
      take,
      skip,
    }
    return this.tokenExchangeRateRepository.find(findOptions)
  }

  async findTokenExchangeRatesPage(sort: string, limit: number = 10, offset: number = 0, symbols: string[] = []): Promise<[TokenExchangeRateEntity[], number]> {
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
    const where = symbols.length > 0 ? { symbol: Any(symbols) } : {}
    const findOptions: FindManyOptions = {
      where,
      order,
      take: limit,
      skip: offset,
    }
    return this.tokenExchangeRateRepository.findAndCount(findOptions)
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count()
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({ where: { symbol } })
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({ where: { address }, relations: ['contract'] })
  }

  async findContractInfoForToken(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({ where: { address }, select: ['address', 'creator'] })
  }

  async countTokenHolders(address: string): Promise<number> {
    let numHolders = await this.erc20BalanceRepository.count({ where: { contract: address } })
    if (!numHolders || numHolders === 0) {
      numHolders = await this.erc721BalanceRepository.count({ where: { contract: address } })
    }
    return numHolders
  }

  async totalValueUSDByAddress(address: string): Promise<BigNumber | undefined> {

    // Only for erc20Tokens as these have fungible value
    const raw = await this.erc20BalanceRepository
      .createQueryBuilder('erc20')
      .leftJoin('erc20.tokenExchangeRate', 'ter')
      .select('SUM(erc20.amount * ter.currentPrice)', 'usdValue')
      .where('erc20.address = :address', { address })
      .andWhere('ter.currentPrice IS NOT NULL')
      .groupBy('erc20.address')
      .getRawOne()

    return raw && raw.usdValue ? new BigNumber(raw.usdValue) : undefined

  }

  async findTokensMetadata(symbols: string[] = []): Promise<TokenMetadataDto[]> {
    const where = symbols.length > 0 ? { symbol: Any(symbols) } : {}
    const findOptions = {
      where,
      relations: ['contractMetadata'],
    }
    const erc20Tokens = await this.erc20MetadataRepository.find(findOptions)
    const erc721Tokens = await this.erc721MetadataRepository.find(findOptions)

    const tokenMetadataDtos: TokenMetadataDto[] = []

    erc20Tokens.forEach(entity => {
      tokenMetadataDtos.push(this.constructTokenMetadataDto(entity))
    })

    erc721Tokens.forEach(entity => {
      tokenMetadataDtos.push(this.constructTokenMetadataDto(entity))
    })

    return tokenMetadataDtos
  }
}
