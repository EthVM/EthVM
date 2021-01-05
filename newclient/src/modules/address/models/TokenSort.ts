import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokensType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721BalanceType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Balances'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts as NFTMetaType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getNFTcontractsMeta'
import BN from 'bignumber.js'

const KEY_NAME = 'name'
const KEY_BALANCE = 'balance'
const KEY_PERCENTAGE_CHANGE = 'price_change_percentage_24h'
const KEY_USD = 'usdValue'

const TOKEN_FILTER_VALUES = ['name_high', 'name_low', 'balance_high', 'balance_low', 'amount_usd_high', 'amount_usd_low', 'change_high', 'change_low']

interface NFTMetaMap {
    [key: string]: NFTMetaType
}
/*
===================================================================================
  Token
===================================================================================
*/

const instanceOfERC20 = (object: any): object is ERC20TokensType => {
    return object.__typename === 'ERC20TokenBalance'
}

interface TokenInterface {
    contract: string
    isERC20: boolean
    symbol: string | null
    name: string | null /*sortable */
    image: string | null
    current_price: number | null
    price_change_percentage_24h: number | null /*sortable */
    balance: BN /*sortable */
    decimals: number | null
    usdValue: BN /*sortable */
}

class Token implements TokenInterface {
    isERC20: boolean
    symbol: string | null = null
    name: string | null = null /*sortable */
    image: string | null = null
    contract: string
    current_price: number | null = null
    price_change_percentage_24h: number | null = null /*sortable */
    balance: BN /*sortable */
    decimals: number | null = null
    usdValue: BN /*sortable */

    /**
     * Constructor
     * @param {ERC20TokensType | ERC721BalanceType} _token
     * @param {Map<string, TokenMarketData> | false} _tokenPrices
     * @param {boolean} _isERC20
     */
    constructor(_token: ERC20TokensType | ERC721BalanceType, _tokenPrices: Map<string, TokenMarketData> | false, _nftMeta: NFTMetaMap | false) {
        const _tokenPriceInfo = _tokenPrices ? this.getUSDInfo(_token.tokenInfo.contract, _tokenPrices) : undefined
        const _nftMetaInfo = _nftMeta ? this.getNFTMeta(_token.tokenInfo.contract, _nftMeta) : undefined
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
        } else {
            this.image = _nftMetaInfo ? _nftMetaInfo.image_url : null
            this.name = _nftMetaInfo ? _nftMetaInfo.name : _token.tokenInfo.name
            this.symbol = _nftMetaInfo ? _nftMetaInfo.symbol : _token.tokenInfo.symbol
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
     * Gets NFT Meta
     * @param contract {String}
     * @returns {TokenMarketData} or {undefined}
     */
    private getNFTMeta(contract: string, nftMetaMap: NFTMetaMap | false): NFTMetaType | undefined {
        if (nftMetaMap && nftMetaMap[contract]) {
            return nftMetaMap[contract]
        }
        return undefined
    }

    /**
     * Gets token balance value
     * @returns {BN}
     */
    private getValue(_token: ERC20TokensType | ERC721BalanceType): BN {
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
    private getUSDValue(_token: ERC20TokensType | ERC721BalanceType, _tokenPriceInfo: TokenMarketData | undefined): BN {
        if (_tokenPriceInfo && _tokenPriceInfo.current_price) {
            return new BN(_tokenPriceInfo.current_price).multipliedBy(this.getValue(_token))
        }
        return new BN(0)
    }
}

/*
===================================================================================
 Sorted Tokens By KEY
===================================================================================
*/

interface SortedInterface {
    key: string
    ascend: Token[]
    desend: Token[]
}

class Sorted implements SortedInterface {
    /* Properties: */
    key: string
    ascend: Token[] = []
    desend: Token[] = []
    /* Constructor: */
    constructor(data: Token[], sortKey: string) {
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
        return sortKey.includes('high') ? this.getDesend() : this.getAscend()
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
    private sortByDescend(data: Token[], key: string): Token[] {
        if (data) {
            if (key === KEY_BALANCE || key === KEY_USD) {
                return data.sort((x, y) => {
                    const a = y[key].toNumber()
                    const b = x[key].toNumber()
                    return a < b ? -1 : a > b ? 1 : 0
                })
            }
            return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
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
}

class TokenSort implements TokenSortInterface {
    tokens: Token[] = []
    name: Sorted
    balance: Sorted
    usdValue: Sorted | null = null
    price24h: Sorted | null = null

    constructor(
        _tokens: ERC20TokensType[] | ERC721BalanceType[],
        _tokenPrices: Map<string, TokenMarketData> | false,
        _nftMeta: NFTMetaMap | false,
        isErc20: boolean
    ) {
        _tokens.forEach(token => {
            this.tokens.push(new Token(token, _tokenPrices, _nftMeta))
        })
        this.name = new Sorted(this.tokens, KEY_NAME)
        this.balance = new Sorted(this.tokens, KEY_BALANCE)

        if (isErc20) {
            this.usdValue = new Sorted(this.tokens, KEY_USD)
            this.price24h = new Sorted(this.tokens, KEY_PERCENTAGE_CHANGE)
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
            case sortKey.includes('balance'):
                return this.balance.getTokens(sortKey)
            case sortKey.includes('amount'):
                return this.usdValue ? this.usdValue.getTokens(sortKey) : []
            case sortKey.includes('change'):
                return this.price24h ? this.price24h.getTokens(sortKey) : []
            default:
                return this.name.getTokens(sortKey)
        }
    }
}

export { TOKEN_FILTER_VALUES, TokenSort, Token, NFTMetaMap }
