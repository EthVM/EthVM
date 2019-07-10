import { CoinExchangeRateEntity } from '@app/orm/entities/coin-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Any, FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { TokenDto } from '@app/graphql/tokens/dto/token.dto'
import { TokenMetadataDto } from '@app/graphql/tokens/dto/token-metadata.dto'
import BigNumber from 'bignumber.js'
import { DbConnection } from '@app/orm/config'
import { TokenExchangeRateFilter } from '@app/graphql/schema'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity, DbConnection.Principal)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(Erc721BalanceEntity, DbConnection.Principal)
    private readonly erc721BalanceRepository: Repository<Erc721BalanceEntity>,
    @InjectRepository(Erc20MetadataEntity, DbConnection.Principal)
    private readonly erc20MetadataRepository: Repository<Erc20MetadataEntity>,
    @InjectRepository(Erc721MetadataEntity, DbConnection.Principal)
    private readonly erc721MetadataRepository: Repository<Erc721MetadataEntity>,
    @InjectRepository(TokenExchangeRateEntity, DbConnection.Principal)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(ContractEntity, DbConnection.Principal)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(CoinExchangeRateEntity, DbConnection.Principal)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
  ) {
  }

  async findTokenHolders(address: string, limit: number = 10, offset: number = 0): Promise<[Erc20BalanceEntity[] | Erc721BalanceEntity[], number]> {
    const findOptions: FindManyOptions = {
      where: {contract: address},
      take: limit,
      skip: offset,
      cache: true,
    }
    const findOptionsErc20: FindManyOptions = {...findOptions, select: ['address', 'amount']}
    const erc20Balances = await this.erc20BalanceRepository.findAndCount(findOptionsErc20)
    if (erc20Balances[1] > 0) {
      return erc20Balances
    }
    return await this.erc721BalanceRepository.findAndCount(findOptions)
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {
    const where = {contract: tokenAddress, address: holderAddress}
    const erc20Balance = await this.erc20BalanceRepository.findOne({where, cache: true})
    if (erc20Balance) return erc20Balance
    return this.erc721BalanceRepository.findOne({where})
  }

  async findAddressAllTokensOwned(address: string, offset: number = 0, limit: number = 10): Promise<[TokenDto[], number]> {

    const findOptions: FindManyOptions = {
      where: {address},
      relations: ['tokenExchangeRate', 'metadata', 'contractMetadata'],
      take: limit,
      skip: offset,
      cache: true,
    }

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
    const {tokenExchangeRate, metadata, contractMetadata} = entity
    const tokenData = metadata || ({} as any)
    if (entity instanceof Erc20BalanceEntity) {
      tokenData.balance = entity.amount
    }
    if (contractMetadata) {
      tokenData.image = contractMetadata.logo
    }
    if (tokenExchangeRate) {
      tokenData.currentPrice = tokenExchangeRate.currentPrice
      tokenData.priceChangePercentage24h = tokenExchangeRate.priceChangePercentage24h
      tokenData.image = tokenData.image || tokenExchangeRate.image
    }
    return new TokenDto(tokenData)
  }

  private constructTokenMetadataDto(entity: Erc20MetadataEntity | Erc721MetadataEntity): TokenMetadataDto {

    const decimals = entity instanceof Erc20MetadataEntity ? entity.decimals : null
    const {contractMetadata} = entity
    const support = contractMetadata ? contractMetadata.support : null
    const logo = contractMetadata ? contractMetadata.logo : null

    const data = {
      name: entity.name,
      address: entity.address,
      symbol: entity.symbol,
      decimals,
      website: contractMetadata ? contractMetadata.website : null,
      email: this.extractFromJson('email', support),
      logo: this.extractFromJson('src', logo),
    }

    return new TokenMetadataDto(data)
  }

  private extractFromJson(field: string, json?: string | null): string | undefined {

    if (!json) {
      return undefined
    }

    let extracted

    try {
      extracted = JSON.parse(json)[field]
    } catch (e) {
      return 'Invalid JSON'
    }

    return extracted

  }

  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: {id: pair},
      cache: true,
    }
    return this.coinExchangeRateRepository.findOne(findOptions)
  }

  async findTokenExchangeRates(
    sort: TokenExchangeRateFilter,
    limit: number = 10,
    offset: number = 0,
    symbols: string[] = [],
  ): Promise<[TokenExchangeRateEntity[], number]> {

    const queryBuilder = this.tokenExchangeRateRepository.createQueryBuilder('ter')

    if (symbols.length) {
      // convert symbols to lowercase to match case-insensitive
      symbols = symbols.map(s => s.toLowerCase())
      queryBuilder.where('LOWER(symbol) IN (:...symbols)', { symbols })
    }

    switch (sort) {
      case TokenExchangeRateFilter.price_high:
        queryBuilder.orderBy('current_price', 'DESC')
        break
      case TokenExchangeRateFilter.price_low:
        queryBuilder.orderBy('current_price', 'ASC')
        break
      case TokenExchangeRateFilter.volume_high:
        queryBuilder.orderBy('total_volume', 'DESC')
        break
      case TokenExchangeRateFilter.volume_low:
        queryBuilder.orderBy('total_volume', 'ASC')
        break
      case TokenExchangeRateFilter.market_cap_high:
        queryBuilder.orderBy('market_cap', 'DESC')
        break
      case TokenExchangeRateFilter.market_cap_low:
        queryBuilder.orderBy('market_cap', 'ASC')
        break
      case TokenExchangeRateFilter.market_cap_rank:
      default:
        queryBuilder.orderBy('market_cap_rank', 'ASC')
        break
    }

    return queryBuilder
      .offset(offset)
      .limit(limit)
      .cache(true)
      .getManyAndCount()
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count({cache: true})
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({where: {symbol}, cache: true})
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({
      where: {address},
      relations: ['contract', 'contract.metadata'],
      cache: true,
    })
  }

  async countTokenHolders(address: string): Promise<number> {
    let numHolders = await this.erc20BalanceRepository.count({where: {contract: address}, cache: true})
    if (!numHolders || numHolders === 0) {
      numHolders = await this.erc721BalanceRepository.count({where: {contract: address}, cache: true})
    }
    return numHolders
  }

  async totalValueUSDByAddress(address: string): Promise<BigNumber | undefined> {

    // Only for erc20Tokens as these have fungible value
    const raw = await this.erc20BalanceRepository
      .createQueryBuilder('erc20')
      .leftJoin('erc20.tokenExchangeRate', 'ter')
      .select('SUM(erc20.amount * ter.currentPrice)', 'usdValue')
      .where('erc20.address = :address', {address})
      .andWhere('ter.currentPrice IS NOT NULL')
      .groupBy('erc20.address')
      .getRawOne()

    return raw && raw.usdValue ? new BigNumber(raw.usdValue) : undefined

  }

  async findTokensMetadata(symbols: string[] = []): Promise<TokenMetadataDto[]> {
    const where = symbols.length > 0 ? {symbol: Any(symbols)} : {}
    const findOptions = {
      where,
      relations: ['contractMetadata'],
      cache: true,
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
