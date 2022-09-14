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
    PRICE = 'current_price'
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
    `${KEY.PRICE}_${DIRECTION.HIGH}`
]
/*
===================================================================================
  Token
===================================================================================
*/

const instanceOfERC20 = (object: any): object is ERC20TokensType => {
    return object.__typename === 'ERC20TokenBalance'
}

interface TokenInterface {
    // contract, symbol, name, image
    contract: string
    isERC20: boolean
    symbol: string | null | undefined
    name: string | null | undefined /*sortable */
    image: string | null | undefined
    current_price: number | null | undefined
    price_change_percentage_24h: number | null | undefined /*sortable */
    balance: BN /*sortable */
    decimals: number | null | undefined
    usdValue: BN /*sortable */
}

class Token implements TokenInterface {
    isERC20: boolean
    symbol: string | null | undefined = null
    name: string | null | undefined = null /*sortable */
    image: string | null | undefined = null
    contract: string
    current_price: number | null | undefined = null
    price_change_percentage_24h: number | null | undefined = null /*sortable */
    balance: BN /*sortable */
    decimals: number | null | undefined = null
    usdValue: BN /*sortable */

    /**
     * Constructor
     * @param {ERC20TokensType} _token
     * @param {Map<string, TokenMarketData> | false} _tokenPrices
     * @param {boolean} _isERC20
     */
    constructor(_token: ERC20TokensType, _tokenPrices: Map<string, TokenMarketData> | false) {
        const _tokenPriceInfo = _tokenPrices ? this.getUSDInfo(_token.tokenInfo.contract, _tokenPrices) : undefined
        this.isERC20 = instanceOfERC20(_token)
        this.contract = _token.tokenInfo.contract
        this.balance = this.getValue(_token)
        this.usdValue = this.getUSDValue(_token, _tokenPriceInfo)
        if (instanceOfERC20(_token)) {
            this.decimals = 'decimals' in _token.tokenInfo ? _token.tokenInfo.decimals : null
            this.name = _tokenPriceInfo ? _tokenPriceInfo.name : _token.tokenInfo.name
            this.symbol = _tokenPriceInfo ? _tokenPriceInfo.symbol : _token.tokenInfo.symbol
            this.current_price = _tokenPriceInfo ? _tokenPriceInfo.current_price : null
            this.price_change_percentage_24h = _tokenPriceInfo ? _tokenPriceInfo.price_change_percentage_24h : null
            this.image = _tokenPriceInfo ? _tokenPriceInfo.image : null
        }
    }

    /**
     * Gets USD prices for a token
     * @param contract {String}
     * @returns {TokenMarketData} or {undefined}
     */
    private getUSDInfo(contract: string, _tokenPrices: Map<string, TokenMarketData>): TokenMarketData | undefined {
        if (_tokenPrices && _tokenPrices.has(contract)) {
            return _tokenPrices.get(contract)
        }
        return undefined
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
    public getPriceChangeFormatted(): string {
        if (this.price_change_percentage_24h) {
            return `${formatPercentageValue(this.price_change_percentage_24h).value}%`
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
    ascend: Token[]
    desend: Token[]
}

class Sorted implements SortedInterface {
    /* Properties: */
    key: KEY
    ascend: Token[] = []
    desend: Token[] = []
    /* Constructor: */
    constructor(data: Token[], sortKey: KEY) {
        this.key = sortKey
        if (data.length > 0) {
            this.desend = [...this.sortByDescend(data, sortKey)]
            this.ascend = [...this.desend].reverse()
        }
    }
    /**
     * return sorted array
     * @param {string} sortKey - must be in TOKEN_FILTER_VALUES
     * @returns { Token[] } - sorted array
     * - Returns { desend } - if sortKey includes 'high'
     * - Returns { ascend } - otherwise
     */
    getTokens(sortKey: string): Token[] {
        return sortKey.includes(DIRECTION.HIGH) ? this.getDesend() : this.getAscend()
    }

    /**
     * Return  array sorted from low to high
     * @returns { Token[] } - sorted array
     */
    private getAscend(): Token[] {
        return this.ascend
    }

    /**
     * Return  array sorted from high to low
     * @returns { Token[] } - sorted array
     */
    private getDesend(): Token[] {
        return this.desend
    }

    /**
     * Return  array sorted from  high to low
     * When sorting by balance or USD, since values are BN, it needs to be converted to Number
     * @returns { Token[] } - sorted array
     */
    private sortByDescend(data: Token[], key: KEY): Token[] {
        if (data?.length && key) {
            if (key === KEY.BALANCE || key === KEY.USD) {
                return data.sort((x, y) => {
                    const a = y[key].toNumber()
                    const b = x[key].toNumber()
                    return a < b ? -1 : a > b ? 1 : 0
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
interface TokenSortInterface {
    tokens: Token[]
    name: Sorted
    balance: Sorted
    usdValue: Sorted | null
    price24h: Sorted | null
    symbol: Sorted | null
    currentPrice: Sorted | null
}

class TokenSort implements TokenSortInterface {
    tokens: Token[] = []
    name: Sorted
    balance: Sorted
    usdValue: Sorted | null = null
    price24h: Sorted | null = null
    symbol: Sorted | null = null
    currentPrice: Sorted | null = null

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
                return this.balance.getTokens(sortKey)
            case sortKey.includes(KEY.USD):
                return this.usdValue ? this.usdValue.getTokens(sortKey) : []
            case sortKey.includes(KEY.PERCENTAGE_CHANGE):
                return this.price24h ? this.price24h.getTokens(sortKey) : []
            case sortKey.includes(KEY.SYMBOL):
                return this.symbol ? this.symbol.getTokens(sortKey) : []
            case sortKey.includes(KEY.PRICE):
                return this.currentPrice ? this.currentPrice.getTokens(sortKey) : []
            default:
                return this.name.getTokens(sortKey)
        }
    }
}

export { TOKEN_FILTER_VALUES, KEY, DIRECTION, TokenSort, Token }
