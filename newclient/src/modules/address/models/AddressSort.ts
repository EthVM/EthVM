import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokensType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721BalanceType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Balances'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { getAddressERC20Transfers_getERC20Transfers as ERC20TransfersType } from '@app/modules/address/handlers/AddressTransfers/apolloTypes/getAddressERC20Transfers'
import { getAddressERC721Transfers_getERC721Transfers as ERC721TransfersType } from '@app/modules/address/handlers/AddressTransfers/apolloTypes/getAddressERC721Transfers'
import { getAddressEthTransfers_getEthTransfersV2 as EthTransfersType } from '@app/modules/address/handlers/AddressTransfers/apolloTypes/getAddressEthTransfers'

import BN from 'bignumber.js'

const KEY_AMOUNT = 'amount'
const KEY_AMOUNT_USD = 'amountUSD'
const KEY_NAME = 'name'
const KEY_PERCENTAGE_CHANGE = 'percentageChange'

export const TOKEN_FILTER_VALUES = ['name_high', 'name_low', 'amount_high', 'amount_low', 'amount_usd_high', 'amount_usd_low', 'change_high', 'change_low']
export const TRANSFER_FILTER_VALUES = ['name_high', 'name_low', 'amount_high', 'amount_low', 'amount_usd_high', 'amount_usd_low', 'change_high', 'change_low']

export class TokenSort {
    isERC20: Boolean
    tokenPrices: Map<string, TokenMarketData> | false

    constructor(_tokens: ERC20TokensType[] | ERC721BalanceType[], _isERC20: boolean, _tokenPrices: Map<string, TokenMarketData> | false) {
        this.isERC20 = _isERC20
        this.tokenPrices = _tokenPrices
        _tokens.forEach(token => {
            const _tokenPriceInfo = this.getUSDInfo(token.tokenInfo.contract)
            token.name = token.tokenInfo.name.toLowerCase()
            token.amount = this.getBalance(token)
            token.amountUSD = this.getUSDValue(token, _tokenPriceInfo)
            token.percentageChange = this.getPercentChange(_tokenPriceInfo)
        })
    }
    /**
     * Gets USD prices for a token
     * @param contract {String}
     * @returns {TokenMarketData} or {undefined}
     */
    getUSDInfo(contract: string): TokenMarketData | undefined {
        if (this.tokenPrices && this.tokenPrices.has(contract)) {
            return this.tokenPrices.get(contract)
        }
        return undefined
    }
    getUSDValue(_token, _tokenPriceInfo): number {
        if (this.isERC20 && _tokenPriceInfo && _tokenPriceInfo.current_price) {
            return new BN(_tokenPriceInfo.current_price).multipliedBy(this.getValue(_token)).toNumber()
        }
        return 0
    }
    getBalance(_token): number {
        if (this.isERC20) {
            return this.getValue(_token).toNumber()
        }
        return new BN(_token.balance).toNumber()
    }
    getPercentChange(_tokenPriceInfo): Number | null {
        return _tokenPriceInfo && _tokenPriceInfo.price_change_percentage_24h ? new BN(_tokenPriceInfo.price_change_percentage_24h).toNumber() : null
    }
    /**
     * Gets token balance value
     * @returns {BN}
     */
    getValue(_token): BN {
        if (this.isERC20) {
            let n = new BN(_token.balance)
            if ('decimals' in _token.tokenInfo && _token.tokenInfo.decimals) {
                n = n.div(new BN(10).pow(_token.tokenInfo.decimals))
            }
            return n
        }
        return new BN(_token.balance)
    }
    sortByDescend(data: ERC20TokensType[] | ERC721BalanceType[], key: string) {
        if (data) {
            return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
        }
        return []
    }
    sortByAscend(data: ERC20TokensType[] | ERC721BalanceType[], key: string) {
        return this.sortByDescend(data, key).reverse()
    }
    sortTokens(data: ERC20TokensType[] | ERC721BalanceType[], sort: string) {
        if (sort === TOKEN_FILTER_VALUES[0] || sort === TOKEN_FILTER_VALUES[1]) {
            /* Sort By Name: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
        } else if (sort === TOKEN_FILTER_VALUES[2] || sort === TOKEN_FILTER_VALUES[3]) {
            /* Sort By Amount: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_AMOUNT) : this.sortByAscend(data, KEY_AMOUNT)
        } else if (sort === TOKEN_FILTER_VALUES[4] || sort === TOKEN_FILTER_VALUES[5]) {
            /* Sort By Amount USD: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_AMOUNT_USD) : this.sortByAscend(data, KEY_AMOUNT_USD)
        }
        /* Sort By Percentage change: */
        return sort.includes('high') ? this.sortByAscend(data, KEY_PERCENTAGE_CHANGE) : this.sortByDescend(data, KEY_PERCENTAGE_CHANGE)
    }
}


export class TransferSort {
    constructor(_transfers: EthTransfersType | ERC20TransfersType | ERC721TransfersType) {
        console.error('tokens', _transfers)
        // this.isERC20 = _isERC20
        // this.tokenPrices = _tokenPrices
        // _tokens.forEach(token => {
        //     const _tokenPriceInfo = this.getUSDInfo(token.tokenInfo.contract)
        //     token.name = token.tokenInfo.name.toLowerCase()
        //     token.amount = this.getBalance(token)
        //     token.amountUSD = this.getUSDValue(token, _tokenPriceInfo)
        //     token.percentageChange = this.getPercentChange(_tokenPriceInfo)
        // })
    }
    /**
     * Gets USD prices for a token
     * @param contract {String}
     * @returns {TokenMarketData} or {undefined}
     */
    getUSDInfo(contract: string): TokenMarketData | undefined {
        if (this.tokenPrices && this.tokenPrices.has(contract)) {
            return this.tokenPrices.get(contract)
        }
        return undefined
    }
    getUSDValue(_token, _tokenPriceInfo): number {
        if (this.isERC20 && _tokenPriceInfo && _tokenPriceInfo.current_price) {
            return new BN(_tokenPriceInfo.current_price).multipliedBy(this.getValue(_token)).toNumber()
        }
        return 0
    }
    getBalance(_token): number {
        if (this.isERC20) {
            return this.getValue(_token).toNumber()
        }
        return new BN(_token.balance).toNumber()
    }
    getPercentChange(_tokenPriceInfo): Number | null {
        return _tokenPriceInfo && _tokenPriceInfo.price_change_percentage_24h ? new BN(_tokenPriceInfo.price_change_percentage_24h).toNumber() : null
    }
    /**
     * Gets transfer balance value
     * @returns {BN}
     */
    getValue(_token): BN {
        let n = new BN(value)
        if (this.transfer.tokenInfo.decimals) {
            n = n.div(new BN(10).pow(this.transfer.tokenInfo.decimals))
        }
        return n
    }
    sortByDescend(data: EthTransfersType | ERC20TransfersType | ERC721TransfersType, key: string) {
        if (data) {
            return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
        }
        return []
    }
    sortByAscend(data: EthTransfersType | ERC20TransfersType | ERC721TransfersType, key: string) {
        return this.sortByDescend(data, key).reverse()
    }
    sortTokens(data: EthTransfersType | ERC20TransfersType | ERC721TransfersType, sort: string) {
        if (sort === TOKEN_FILTER_VALUES[0] || sort === TOKEN_FILTER_VALUES[1]) {
            /* Sort By Name: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
        } else if (sort === TOKEN_FILTER_VALUES[2] || sort === TOKEN_FILTER_VALUES[3]) {
            /* Sort By Amount: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_AMOUNT) : this.sortByAscend(data, KEY_AMOUNT)
        } else if (sort === TOKEN_FILTER_VALUES[4] || sort === TOKEN_FILTER_VALUES[5]) {
            /* Sort By Amount USD: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_AMOUNT_USD) : this.sortByAscend(data, KEY_AMOUNT_USD)
        }
        /* Sort By Percentage change: */
        return sort.includes('high') ? this.sortByAscend(data, KEY_PERCENTAGE_CHANGE) : this.sortByDescend(data, KEY_PERCENTAGE_CHANGE)
    }
}