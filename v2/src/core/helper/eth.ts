import Web3Utils from 'web3-utils'

const eth = {
    isValidHash: (raw: string): boolean => /^(0x[0-9a-fA-F]{64}|0xGENESIS_{17}[0-9a-fA-F]{40})$/.test(raw),
    isValidBlockNumber: (raw = ''): boolean => {
        const isNum = /^\d+$/.test(raw)
        const n = Number(raw)
        return !isNaN(n) && Number.isInteger(n) && n >= 0 && isNum
    },
    isValidAddress: (address: string): boolean => !!address && Web3Utils.isHexStrict(address) && Web3Utils.isAddress(address),
    toCheckSum: (value: string) => {
        return value ? (value.length === 42 ? Web3Utils.toChecksumAddress(value) : value) : ''
    },
    toEthFromWei(wei: number | string) {
        const weiBN = Web3Utils.toBN(wei)
        return Web3Utils.fromWei(weiBN, 'ether')
    }
}

export { eth }
