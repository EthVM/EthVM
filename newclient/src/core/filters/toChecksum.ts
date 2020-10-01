import { toChecksumAddress } from 'web3-utils'

export default value => {
    return value.length > 42 ? value : toChecksumAddress(value)
}
