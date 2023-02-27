import { TokenOwnersFragment as ERC20TokensType } from '@module/address/apollo/AddressTokens/tokens.generated'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import BN from 'bignumber.js'
import { formatUsdValue, formatFloatingPointValue, formatPercentageValue } from '@core/helper/number-format-helper'

enum DIRECTION {
    HIGH = 'high',
    LOW = 'low'
}
enum KEY {
    NAME = 'name',
    BALANCE = 'balance',
    PERCENTAGE_CHANGE = 'price_change_percentage_24h',
    USD = 'usdValue',
    SYMBOL = 'symbol',
    PRICE = 'current_price',
    VOLUME = 'volume',
    MARKET_CAP = 'marketCap',
    SUPPLY = 'supply'
}

const TOKEN_FILTER_VALUES = [
    `${KEY.NAME}_${DIRECTION.LOW}`,
    `${KEY.NAME}_${DIRECTION.HIGH}`,
    `${KEY.BALANCE}_${DIRECTION.LOW}`,
    `${KEY.BALANCE}_${DIRECTION.HIGH}`,
    `${KEY.USD}_${DIRECTION.LOW}`,
    `${KEY.USD}_${DIRECTION.HIGH}`,
    `${KEY.PERCENTAGE_CHANGE}_${DIRECTION.LOW}`,
    `${KEY.PERCENTAGE_CHANGE}_${DIRECTION.HIGH}`,
    `${KEY.PRICE}_${DIRECTION.LOW}`,
    `${KEY.PRICE}_${DIRECTION.HIGH}`,
    `${KEY.VOLUME}_${DIRECTION.LOW}`,
    `${KEY.VOLUME}_${DIRECTION.HIGH}`,
    `${KEY.MARKET_CAP}_${DIRECTION.LOW}`,
    `${KEY.MARKET_CAP}_${DIRECTION.HIGH}`,
    `${KEY.SUPPLY}_${DIRECTION.LOW}`,
    `${KEY.SUPPLY}_${DIRECTION.HIGH}`
]
/*
===================================================================================
  Token
===================================================================================
*/

const instanceOfERC20 = (object: any): object is ERC20TokensType => {
    return object.__typename === 'ERC20TokenBalance'
}

interface TokensMarketInterface {
    symbol: string
    name: string
    image: string
    contract: string
    current_price?: number | null
    market_cap?: number | null
    total_volume?: number | null
    total_supply?: string | null
    price_change_percentage_24h?: number | null
    circulating_supply?: number | null
    high_24h?: number | null
    low_24h?: number | null
}

class TokenMarket implements TokensMarketInterface {
    symbol = '' /*sortable */
    name = 'No Name' /*sortable */
    image = ''
    contract = ''
    current_price: number | null | undefined = null
    price_change_percentage_24h: number | null | undefined = null /*sortable */
    marketCap: number | null | undefined = null
    volume: number | null | undefined = null
    supply: number | null | undefined = null

    /**
     * Constructor
     * @param {ERC20TokensType} _token
     * @param {Map<string, TokenMarketData> | false} _tokenPrices
     * @param {boolean} _isERC20
     */
    constructor(_tokenPriceInfo: TokenMarketData | undefined) {
        if (_tokenPriceInfo) {
            this.contract = _tokenPriceInfo.contract || ''
            this.name = _tokenPriceInfo.name
            this.symbol = _tokenPriceInfo.symbol
            this.current_price = _tokenPriceInfo.current_price
            this.price_change_percentage_24h = _tokenPriceInfo.price_change_percentage_24h
            this.image = _tokenPriceInfo.image
            this.marketCap = _tokenPriceInfo.market_cap
            this.volume = _tokenPriceInfo.total_volume
            this.supply = _tokenPriceInfo.total_supply ? new BN(_tokenPriceInfo.total_supply).toNumber() : null
        }
    }
    public setSymbol(_symbol: string): void {
        this.symbol = _symbol
    }

    public setName(_name: string): void {
        this.name = _name
    }

    public getPriceChangeFormatted(): string {
        if (this.price_change_percentage_24h) {
            return `${formatPercentageValue(this.price_change_percentage_24h).value}%`
        }
        return ''
    }
    public getPriceFormatted(): string {
        if (this.current_price) {
            return `${formatUsdValue(new BN(this.current_price)).value}`
        }
        return ''
    }
    public getMarketCapFormatted(): string {
        if (this.marketCap) {
            return `${formatUsdValue(new BN(this.marketCap)).value} `
        }
        return ''
    }
    public getVolumeFormatted(): string {
        if (this.volume) {
            return `${formatUsdValue(new BN(this.volume)).value}`
        }
        return ''
    }
    public getTotalSupplyFormatted(): string {
        if (this.supply) {
            return `${formatUsdValue(new BN(this.supply)).value}`
        }
        return ''
    }
}

interface TokenInterface extends TokensMarketInterface {
    isERC20: boolean
    balance: BN /*sortable */
    decimals: number | null | undefined
    usdValue: BN /*sortable */
}

class Token extends TokenMarket implements TokenInterface {
    isERC20: boolean
    decimals: number | null | undefined = null
    balance: BN /*sortable */
    usdValue: BN /*sortable */

    /**
     * Constructor
     * @param {ERC20TokensType} _token
     * @param {Map<string, TokenMarketData> | false} _tokenPrices
     * @param {boolean} _isERC20
     */
    constructor(_token: ERC20TokensType, _tokenPrices: Map<string, TokenMarketData> | false) {
        const _tokenPriceInfo = _tokenPrices && _tokenPrices.has(_token.tokenInfo.contract) ? _tokenPrices.get(_token.tokenInfo.contract) : undefined
        super(_tokenPriceInfo)
        this.isERC20 = instanceOfERC20(_token)
        this.contract = _token.tokenInfo.contract
        this.balance = this.getValue(_token)
        this.usdValue = this.getUSDValue(_token, _tokenPriceInfo)
        if (!_tokenPriceInfo) {
            if (_token.tokenInfo.name) {
                super.setName(_token.tokenInfo.name)
            }
            if (_token.tokenInfo.symbol) {
                super.setSymbol(_token.tokenInfo.symbol)
            }
        }
        if (instanceOfERC20(_token)) {
            this.decimals = 'decimals' in _token.tokenInfo ? _token.tokenInfo.decimals : 0
        }
    }

    /**
     * Gets token balance value
     * @returns {BN}
     */
    private getValue(_token: ERC20TokensType): BN {
        let n = new BN(_token.balance)
        if ('decimals' in _token.tokenInfo && _token.tokenInfo.decimals) {
            n = n.div(new BN(10).pow(_token.tokenInfo.decimals))
        }
        return n
    }
    /**
     * Gets token value in USD
     * @returns {BN}
     */
    private getUSDValue(_token: ERC20TokensType, _tokenPriceInfo: TokenMarketData | undefined): BN {
        if (_tokenPriceInfo && _tokenPriceInfo.current_price) {
            return new BN(_tokenPriceInfo.current_price).multipliedBy(this.getValue(_token))
        }
        return new BN(0)
    }

    public getBalanceFormatted(): string {
        if (this.balance.gt(0)) {
            return formatFloatingPointValue(this.balance).value
        }
        return ''
    }

    public getUSDValueFormatted(): string {
        if (this.usdValue.gt(0)) {
            return formatUsdValue(this.usdValue).value
        }
        return ''
    }
}

/*
===================================================================================
 Sorted Tokens By KEY
===================================================================================
*/

interface SortedInterface {
    key: KEY
    ascend: any[]
    desend: any[]
}

class Sorted<T extends TokenMarket | Token> implements SortedInterface {
    /* Properties: */
    key: KEY
    ascend: T[] = []
    desend: T[] = []
    /* Constructor: */
    constructor(data: T[], sortKey: KEY) {
        this.key = sortKey
        if (data.length > 0) {
            this.desend = [...this.sortByDescend(data, sortKey)]
            this.ascend = [...this.desend].reverse()
        }
    }
    /**
     * return sorted array
     * @param {string} sortKey - must be in TOKEN_FILTER_VALUES
     * @returns { T[] } - sorted array
     * - Returns { desend } - if sortKey includes 'high'
     * - Returns { ascend } - otherwise
     */
    getTokens(sortKey: string): T[] {
        return sortKey.includes(DIRECTION.HIGH) ? this.getDesend() : this.getAscend()
    }

    /**
     * Return  array sorted from low to high
     * @returns { T[] } - sorted array
     */
    private getAscend(): T[] {
        return this.ascend
    }

    /**
     * Return  array sorted from high to low
     * @returns { T[] } - sorted array
     */
    private getDesend(): T[] {
        return this.desend
    }

    /**
     * Return  array sorted from  high to low
     * When sorting by balance or USD, since values are BN, it needs to be converted to Number
     * @returns { T[] } - sorted array
     */
    private sortByDescend(data: T[], key: KEY): T[] {
        if (data?.length && key) {
            if (key === KEY.BALANCE || key === KEY.USD) {
                return data.sort((x, y) => {
                    const i = x[key as keyof T] as unknown as BN
                    const _y = y[key as keyof T] as unknown as BN
                    if (BN.isBigNumber(i) && BN.isBigNumber(_y)) {
                        const a = _y.toNumber()
                        const b = i.toNumber()
                        return a < b ? -1 : a > b ? 1 : 0
                    }

                    return 0
                })
            }
            // convert to lowercase for name and symbol sort
            if (key === KEY.NAME || key === KEY.SYMBOL) {
                return data.sort((x, y) => {
                    const a = y[key]?.toString().toLowerCase()
                    const b = x[key]?.toString().toLowerCase()
                    if (a && b) {
                        return a < b ? -1 : a > b ? 1 : 0
                    }
                    return 0
                })
            }
            return data.sort((x, y) => (y[key]! < x[key]! ? -1 : y[key]! > x[key]! ? 1 : 0))
        }
        return []
    }
}

/*
===================================================================================
 Sorted Tokens Class
===================================================================================
*/
interface TokenSortMarketInterface {
    tokens: TokenMarket[]
}

class TokenSortMarket implements TokenSortMarketInterface {
    tokens: TokenMarket[] = []
    name: Sorted<TokenMarket>
    price24h: Sorted<TokenMarket> | null = null
    symbol: Sorted<TokenMarket> | null = null
    currentPrice: Sorted<TokenMarket> | null = null
    marketCap: Sorted<TokenMarket> | null = null
    volume: Sorted<TokenMarket> | null = null
    supply: Sorted<TokenMarket> | null = null

    constructor(_tokens: TokenMarket[]) {
        _tokens.forEach(token => {
            if (token) {
                this.tokens.push(token)
            }
        })
        this.name = new Sorted(this.tokens, KEY.NAME)
        this.price24h = new Sorted(this.tokens, KEY.PERCENTAGE_CHANGE)
        this.symbol = new Sorted(this.tokens, KEY.SYMBOL)
        this.currentPrice = new Sorted(this.tokens, KEY.PRICE)
        this.volume = new Sorted(this.tokens, KEY.VOLUME)
        this.marketCap = new Sorted(this.tokens, KEY.MARKET_CAP)
        this.supply = new Sorted(this.tokens, KEY.SUPPLY)
    }

    /**
     * Returns sorted array accordign to the specified sorting Key
     * @param {string} sortKey - must be in TOKEN_FILTER_VALUES
     * @returns { TokenMarket[] } - sorted array
     * - Returns { balance } - sorted array by tokens Balance,  if sortKey includes 'balance'
     * - Returns { usdValue } - sorted array by tokens USD value,  if sort Key includes 'amount'
     * - Return { price24H } - sorted array by tokens price percenatge change, if sortKey includes 'change'
     * - Returns { name } - sorted array by tokens Names, otherwise
     */
    getSortedTokens(sortKey: string): TokenMarket[] {
        switch (true) {
            case sortKey.includes(KEY.PERCENTAGE_CHANGE):
                return this.price24h ? this.price24h.getTokens(sortKey) : []
            case sortKey.includes(KEY.SYMBOL):
                return this.symbol ? this.symbol.getTokens(sortKey) : []
            case sortKey.includes(KEY.PRICE):
                return this.currentPrice ? this.currentPrice.getTokens(sortKey) : []
            case sortKey.includes(KEY.VOLUME):
                return this.volume ? this.volume.getTokens(sortKey) : []
            case sortKey.includes(KEY.MARKET_CAP):
                return this.marketCap ? this.marketCap.getTokens(sortKey) : []
            case sortKey.includes(KEY.SUPPLY):
                return this.supply ? this.supply.getTokens(sortKey) : []
            default:
                return this.name.getTokens(sortKey)
        }
    }
}

interface TokenSortInterface extends TokenSortMarketInterface {
    tokens: Token[]
    balance: Sorted<Token> | null
    usdValue: Sorted<Token> | null
}

class TokenSort implements TokenSortInterface {
    tokens: Token[] = []
    balance: Sorted<Token> | null = null
    usdValue: Sorted<Token> | null = null
    name: Sorted<Token>
    price24h: Sorted<Token> | null = null
    symbol: Sorted<Token> | null = null
    currentPrice: Sorted<Token> | null = null
    marketCap: Sorted<Token> | null = null
    volume: Sorted<Token> | null = null
    supply: Sorted<Token> | null = null

    constructor(_tokens: Array<ERC20TokensType | null>, _tokenPrices: Map<string, TokenMarketData> | false, isErc20: boolean) {
        _tokens.forEach(token => {
            if (token) {
                this.tokens.push(new Token(token, _tokenPrices))
            }
        })
        this.name = new Sorted(this.tokens, KEY.NAME)
        this.balance = new Sorted(this.tokens, KEY.BALANCE)
        if (isErc20) {
            this.usdValue = new Sorted(this.tokens, KEY.USD)
            this.price24h = new Sorted(this.tokens, KEY.PERCENTAGE_CHANGE)
            this.symbol = new Sorted(this.tokens, KEY.SYMBOL)
            this.currentPrice = new Sorted(this.tokens, KEY.PRICE)
            this.volume = new Sorted(this.tokens, KEY.VOLUME)
            this.marketCap = new Sorted(this.tokens, KEY.MARKET_CAP)
            this.supply = new Sorted(this.tokens, KEY.SUPPLY)
        }
    }

    /**
     * Returns sorted array accordign to the specified sorting Key
     * @param {string} sortKey - must be in TOKEN_FILTER_VALUES
     * @returns { Token[] } - sorted array
     * - Returns { balance } - sorted array by tokens Balance,  if sortKey includes 'balance'
     * - Returns { usdValue } - sorted array by tokens USD value,  if sort Key includes 'amount'
     * - Return { price24H } - sorted array by tokens price percenatge change, if sortKey includes 'change'
     * - Returns { name } - sorted array by tokens Names, otherwise
     */
    getSortedTokens(sortKey: string): Token[] {
        switch (true) {
            case sortKey.includes(KEY.BALANCE):
                return this.balance ? this.balance.getTokens(sortKey) : []
            case sortKey.includes(KEY.USD):
                return this.usdValue ? this.usdValue.getTokens(sortKey) : []
            case sortKey.includes(KEY.PERCENTAGE_CHANGE):
                return this.price24h ? this.price24h.getTokens(sortKey) : []
            case sortKey.includes(KEY.SYMBOL):
                return this.symbol ? this.symbol.getTokens(sortKey) : []
            case sortKey.includes(KEY.PRICE):
                return this.currentPrice ? this.currentPrice.getTokens(sortKey) : []
            case sortKey.includes(KEY.VOLUME):
                return this.volume ? this.volume.getTokens(sortKey) : []
            case sortKey.includes(KEY.MARKET_CAP):
                return this.marketCap ? this.marketCap.getTokens(sortKey) : []
            case sortKey.includes(KEY.SUPPLY):
                return this.supply ? this.supply.getTokens(sortKey) : []
            default:
                return this.name.getTokens(sortKey)
        }
    }
}

export { TOKEN_FILTER_VALUES, KEY, DIRECTION, TokenSort, Token, TokenSortMarket, TokenMarket }
