import { toChecksumAddress } from 'web3-utils'

export default (value: string): string => {
    return value.length > 42 ? value : toChecksumAddress(value)
}
