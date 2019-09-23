/* tslint:disable:no-trailing-whitespace */
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {Any, EntityManager, FindManyOptions, FindOneOptions, In, LessThanOrEqual, Repository} from 'typeorm'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity'
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'
import {TokenMetadataEntity} from '@app/orm/entities/token-metadata.entity'
import {TokenDetailEntity} from '@app/orm/entities/token-detail.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {AddressTokenCountEntity} from '@app/orm/entities/address-token-count.entity'
import {ContractHolderCountEntity} from '@app/orm/entities/contract-holder-count.entity'
import {ExchangeRatePair, TokenExchangeRateFilter} from '@app/graphql/schema'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto';

/**
 * @const
 * @type {BigNumber}
 * @default
 */
const zeroBN = new BigNumber(0)

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(CoinExchangeRateEntity)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(TokenMetadataEntity)
    private readonly tokenMetadataRepository: Repository<TokenMetadataEntity>,
    @InjectRepository(TokenDetailEntity)
    private readonly tokenDetailRepository: Repository<TokenDetailEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
  }

  /**
   * Find a page of positive balances for a given contract address (currently only ERC20 tokens are handled).
   * @param {string} contractAddress - The address hash of the contract.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Balance updates after this block number will be ignored.
   * @returns {Promise<[BalanceEntity[], boolean, BigNumber]>} - An array of BalanceEntities, a boolean indicating if there are more items after these and
   * the total number of positive balances for this contract address as of this block number.
   */
  async findAllTokenBalancesForContract(
    contractAddress: string,
    limit: number = 10,
    offset: number = 0,
    blockNumber: BigNumber,
  ): Promise<[RawBalanceEntity[], boolean, BigNumber]> {

    // TODO handle ERC721

    // Get the latest count of positive balances for this contract address.
    const erc20Count = await this.entityManager.findOne(ContractHolderCountEntity, {
      where: {contractAddress, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
      order: {blockNumber: 'DESC'},
      cache: true,
    })

    // If the count is zero or no entry was found, return an empty array.
    const count = erc20Count ? erc20Count.count : zeroBN
    if (count.isEqualTo(0)) {
      return [[], false, count]
    }

    // Use a "with" clause to get only the latest balance entry per address.
    // Ask for an extra item to determine whether there is another page of items after this.
    const balances = await this.entityManager.query(`
      WITH _balances as (
        SELECT
          *,
          row_number() OVER (PARTITION BY address ORDER BY block_number DESC) AS row_number
          FROM balance
          WHERE contract_address = $1
          AND balance > 0
          AND block_number <= $2
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $3
      LIMIT $4
    `, [contractAddress, blockNumber.toNumber(), offset, limit + 1])

    // If there are more items returned than the given limit, there is another page of items after this one.
    // Ensure to remove the extra item before returning the array.
    const hasMore = balances.length > limit
    if (hasMore) {
      balances.pop()
    }
    return [balances, hasMore, count]
  }

  /**
   * Find the latest balance for a given address and contract address combination.
   * @param {string} tokenAddress - The contract address hash.
   * @param {string} holderAddress - The address hash of the token holder.
   * @param {BigNumber} blockNumber - Balance updates after this block number will be ignored.
   * @returns {Promise<BalanceEntity | undefined>}
   */
  async findTokenBalance(tokenAddress: string, holderAddress: string, blockNumber: BigNumber): Promise<BalanceEntity | undefined> {
    const where = {contract: tokenAddress, address: holderAddress, blockNumber: LessThanOrEqual(blockNumber)}
    return this.balanceRepository.findOne({where, cache: true, order: {blockNumber: 'DESC'}})
  }

  /**
   * Find a page of token (erc20) balances for a given address.
   * @param {string} address - The address hash of the token holder.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Balance updates after this block number will be ignored.
   * @returns {Promise<[BalanceEntity[], boolean, BigNumber]>} - An array of BalanceEntities, a boolean indicating if there are more items after these and
   * the total number of positive balances for this contract address as of this block number.
   */
  async findAllTokenBalancesForAddress(
    address: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[RawBalanceEntity[], boolean, BigNumber]> {

    return this.entityManager.transaction('READ COMMITTED', async (txn): Promise<[RawBalanceEntity[], boolean, BigNumber]> => {

      // Get the latest count of positive token balances (not Ether) for this address.
      const erc20Count = await txn.findOne(AddressTokenCountEntity, {
        where: {address, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
        order: {blockNumber: 'DESC'},
        cache: true,
      })

      // If no count entry is found or the count is 0, return an empty array.
      const count = erc20Count ? erc20Count.count : zeroBN
      if (count.isEqualTo(0)) {
        return [[], false, count]
      }

      // Use a "with" clause to select only the most recent balance update per token (contract_address).
      // Ask for an extra item to determine whether there is another page of items after this.
      const items = await txn.query(`
      WITH _balances as (
        SELECT
          *,
          row_number() OVER (PARTITION BY address, contract_address ORDER BY block_number DESC) AS row_number
          FROM balance
          WHERE address = $1
          AND token_type = 'ERC20'
          AND balance > 0
          AND block_number <= $2
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $3
      LIMIT $4
    `, [address, blockNumber.toNumber(), offset, limit + 1])

      // If there are more items than the given limit, there is another page of items after this.
      // Ensure the extra item is removing before retrieving relations and returning the array.
      const hasMore = items.length > limit
      if (hasMore) {
        items.pop()
      }

      // Get token relations. Perform this query separately to improve performance.
      const contractAddresses = items.map(i => i.contract_address)
      const contracts = await txn.find(ContractEntity, {
        where: {address: In(contractAddresses), createdAtBlockNumber: LessThanOrEqual(blockNumber)},
        relations: ['ethListContractMetadata', 'contractMetadata', 'tokenExchangeRate'],
        cache: true,
      })

      // Map contracts by contractAddress.
      const contractsByAddress = contracts.reduce((memo, next) => {
        memo[next.address] = next
        return memo
      }, {})

      // Map metadata to balances.
      items
        .forEach(balance => {
          const {ethListContractMetadata, contractMetadata, tokenExchangeRate} = contractsByAddress[balance.contract_address]
          balance.ethListContractMetadata = ethListContractMetadata
          balance.contractMetadata = contractMetadata
          balance.tokenExchangeRate = tokenExchangeRate
        })

      return [items, hasMore, count]

    })
  }

  /**
   * Find the latest exchange rate for a given coin and currency pair.
   * @param {ExchangeRatePair} pair - The pair of coin and currency (e.g. ethereum_usd).
   * @returns {Promise<CoinExchangeRateEntity | undefined>}
   */
  async findCoinExchangeRate(pair: ExchangeRatePair): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: {id: pair},
      cache: true,
    }
    return this.coinExchangeRateRepository.findOne(findOptions)
  }

  /**
   * Find a page of token exchange rate entities.
   * @param {TokenExchangeRateFilter} [sort="market_cap_rank"] - The sort field and direction.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {string[]} [addresses=[]] - An optional array of addresses to filter by.
   * @returns {Promise<[TokenExchangeRateEntity[], number]>} An array of TokenExchangeRateEntities and the total count of entities.
   */
  async findTokenExchangeRates(
    sort: TokenExchangeRateFilter = TokenExchangeRateFilter.market_cap_rank,
    limit: number = 10,
    offset: number = 0,
    addresses: string[] = [],
  ): Promise<[TokenExchangeRateEntity[], number]> {

    // Build the order clause depending on the "sort" provided.
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

    const findOptions: FindManyOptions = {
      order,
      take: limit,
      skip: offset,
      cache: true,
    }

    // Add a where clause if any address hashes are provided.
    if (addresses.length) {
      findOptions.where = {address: Any(addresses)}
    }

    // Perform the find query and get the total count.
    const items = await this.tokenExchangeRateRepository.find(findOptions)
    // TODO count when address hashes are provided (cannot rely on length of hashes array as there may not be an entry).
    const count = await this.countTokenExchangeRates()

    return [items, count]
  }

  /**
   * Count the total number of token exchange rates.
   * @returns {Promise<number>}
   */
  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count({cache: true})
  }

  /**
   * Find a token exchange rate by its symbol.
   * @deprecated
   * @param {string} symbol - The symbol of the token.
   * @returns {Promise<TokenExchangeRateEntity | undefined>}
   */
  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({where: {symbol}, cache: true})
  }

  /**
   * Find a token exchange rate and its metadata and contract relations by its contract address.
   * @param {string} address - The address hash.
   * @returns{Promise<TokenExchangeRateEntity | undefined>}
   */
  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({
      where: {address},
      relations: ['contract', 'contract.contractMetadata', 'contract.ethListContractMetadata'], // TODO confirm all these relations are necessary
      cache: true,
    })
  }

  /**
   * Count the total number of holders of a token (addresses with a positive balance for that contract_address)
   * Currently only implemented for ERC20 tokens
   * @param {string} contractAddress - The address hash of the token.
   * @param {BigNumber} blockNumber - Balance updates after this block number will be ignored.
   * @returns {Promise<BigNumber>}
   */
  async countTokenHolders(contractAddress: string, blockNumber: BigNumber): Promise<BigNumber> {

    // Note this only works for erc20 tokens, not ERC721.
    const contractHolderCount = await this.entityManager.findOne(ContractHolderCountEntity, {
      where: {contractAddress, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
      order: {blockNumber: 'DESC'},
      cache: true,
    })

    return contractHolderCount ? contractHolderCount.count : zeroBN

  }

  /**
   * Get the total value of all ERC20 tokens held by a given address in USD.
   * @param {string} address - The address hash of the token holder.
   * @param {BigNumber} blockNumber - Balance updates after this block number will be ignored.
   * @returns {Promise<BigNumber | undefined>}
   */
  async totalValueUSDByAddress(address: string, blockNumber: BigNumber): Promise<BigNumber | undefined> {

    // Use a "with" clause to select only the latest update for each contract_address.
    // Only select balances for those tokens for which we have an exchange rate.
    // SUM all balances after converting to USD using their exchange rates.
    const raw = await this.entityManager.query(`
      WITH _balances as (
        SELECT
          b.balance AS balance,
          ter.current_price AS current_price,
          row_number() OVER (PARTITION BY b.contract_address ORDER BY b.block_number DESC) AS row_number
          FROM balance AS b
          LEFT JOIN token_exchange_rate AS ter ON b.contract_address = ter.address
          WHERE b.address = $1
          AND b.token_id IS NULL
          AND b.balance > 0
          AND b.block_number <= $2
          AND ter.current_price IS NOT NULL
      )
      SELECT SUM(balance * current_price) FROM _balances
      WHERE row_number = 1
    `, [address, blockNumber.toNumber()])

    return raw && raw.usdValue ? new BigNumber(raw.usdValue) : undefined

  }

  /**
   * Find a page of token metadata
   * @param {string} [addresses=[]] - An optional array of address hashes to filter by.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @returns {Promise<[TokenMetadataEntity[], boolean]>} An array of TokenMetadataEntities and a boolean indicating whether there are more items after these.
   */
  async findTokenMetadata(
    addresses: string[] = [],
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TokenMetadataEntity[], boolean]> {

    const findOptions: FindManyOptions = {
      take: limit + 1, // Request one extra item to determine if there is another page.
      skip: offset,
      cache: true,
    }

    if (addresses.length) {
      findOptions.where = {address: Any(addresses)} // Add a where clause with addresses if provided.
    }

    const items = await this.tokenMetadataRepository.find(findOptions)

    // If there are more items retrieved than the limit, there is another page of items after this one.
    // Ensure to remove the last item from the array if necessry.
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]
  }

  /**
   * Find a TokenDetailEntity by its address.
   * @param {string} address - The address hash.
   * @param {BigNumber} blockNumber - The block number to filter details by address.
   * @returns {Promise<TokenDetailEntity | undefined>}
   */
  async findDetailByAddress(address: string, blockNumber: BigNumber): Promise<TokenDetailEntity | undefined> {
    return this.tokenDetailRepository.findOne({where: { address, createdAtBlockNumber: LessThanOrEqual(blockNumber) }, cache: true})
  }
}
