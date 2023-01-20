import Web3Utils from 'web3-utils'

export interface NftId {
    id: string
    contract: string
}

/**
 * Functions generates id of the nft
 * Converts from Hex if necessary
 * @_value - id of the nft
 */
export const generateId = (_value: string | null | undefined): string => {
    return Web3Utils.isHexStrict(_value || '') ? Web3Utils.hexToNumberString(_value || '') : _value || ''
}

/**
 * Functions generates id to be used in the nftMap
 * use this function to get meta for the nft
 * @_contract - contract of the nft
 * @_id - id of the nft
 */
export const generateMapId = (_contract: string, _id: string | null | undefined): string => {
    return `${_contract}.${generateId(_id)}`.toLowerCase()
}
