import { CoinExchangeRateEntity } from '@app/orm/entities/coin-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Any, FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import BigNumber from 'bignumber.js'
import { TokenMetadataEntity } from '@app/orm/entities/token-metadata.entity'
import { TokenHolderEntity } from '@app/orm/entities/token-holder.entity'
import { TokenBalance } from '@app/graphql/schema'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(CoinExchangeRateEntity)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
    @InjectRepository(TokenMetadataEntity)
    private readonly tokenMetadataRepository: Repository<TokenMetadataEntity>,
    @InjectRepository(TokenHolderEntity)
    private readonly tokenHolderRepository: Repository<TokenHolderEntity>,
  ) {
  }

  async findTokenHolders(address: string, limit: number = 10, offset: number = 0): Promise<[TokenHolderEntity[], number]> {
    return await this.tokenHolderRepository.findAndCount({
      where: {contract: address},
      take: limit,
      skip: offset,
    })
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<TokenHolderEntity | undefined> {
    return this.tokenHolderRepository.findOne({contract: tokenAddress, address: holderAddress})
  }

  async findAddressAllTokensOwned(address: string, offset: number = 0, limit: number = 10): Promise<[TokenBalance[], number]> {
    const findOptions: FindManyOptions = {where: {address}, relations: ['tokenExchangeRate', 'metadata'], take: limit, skip: offset}

    const [tokenBalances, count] = await this.tokenHolderRepository.findAndCount(findOptions)

    // Map TokenHolders to TokenBalances
    const results = tokenBalances.map((tb: TokenHolderEntity) => {

      const { metadata, tokenExchangeRate } = tb;

      return {
        name: metadata ? metadata.name : null,
        website: metadata ? metadata.website : null,
        email: metadata && metadata.support ? JSON.parse(metadata.support).email : null,
        symbol: metadata ? metadata.symbol : null,
        address: tb.contract,
        decimals: metadata ? metadata.decimals : null,
        balance: tb.balance,
        currentPrice: tokenExchangeRate ? tokenExchangeRate.currentPrice : null,
        priceChangePercentage24h: tokenExchangeRate ? tokenExchangeRate.priceChangePercentage24h : null,
        image: metadata ? metadata.logo : null,
      } as TokenBalance
    })

    return [results, count]
  }

  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: {id: pair},
    }
    return this.coinExchangeRateRepository.findOne(findOptions)
  }

  async findTokenExchangeRates(
    sort: string = 'market_cap_rank',
    limit: number = 10,
    offset: number = 0,
    symbols: string[] = [],
    names: string[] = [],
    addresses: string[] = [],
  ): Promise<[TokenExchangeRateEntity[], number]> {
    let order
    switch (sort) {
      case 'price_high':
        order = {currentPrice: -1}
        break
      case 'price_low':
        order = {currentPrice: 1}
        break
      case 'volume_high':
        order = {totalVolume: -1}
        break
      case 'volume_low':
        order = {totalVolume: 1}
        break
      case 'market_cap_high':
        order = {marketCap: -1}
        break
      case 'market_cap_low':
        order = {marketCap: 1}
        break
      case 'market_cap_rank':
      default:
        order = {marketCapRank: 1}
        break
    }

    const where = [] as any[]
    if (symbols.length) {
      where.push({symbol: Any(symbols)})
    }
    if (names.length) {
      where.push({name: Any(names)})
    }
    if (addresses.length) {
      where.push({address: Any(addresses)})
    }

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
    return this.tokenExchangeRateRepository.findOne({where: {symbol}})
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({where: {address}, relations: ['contract', 'contract.metadata']})
  }

  async countTokenHolders(address: string): Promise<number> {
    return await this.tokenHolderRepository.count({where: {contract: address}})
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

  async findTokensMetadata(
    symbols: string[] = [],
    names: string[] = [],
    addresses: string[] = [],
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TokenMetadataEntity[], number]> {
    const where: any[] = []
    if (symbols.length) {
      where.push({symbol: Any(symbols)})
    }
    if (names.length) {
      where.push({name: Any(names)})
    }
    if (addresses.length) {
      where.push({address: Any(addresses)})
    }
    const findOptions = {
      where,
      take: limit,
      skip: offset,
    }
    return await this.tokenMetadataRepository.findAndCount(findOptions)
  }
}
