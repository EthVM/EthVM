import web3Utils from 'web3-utils'

const eth = {
    isValidHash: (raw: any): boolean => /^(0x[0-9a-fA-F]{64}|0xGENESIS_{17}[0-9a-fA-F]{40})$/.test(raw),
    isValidBlockNumber: (raw: any = ''): boolean => {
        const isNum = /^\d+$/.test(raw)
        const n = Number(raw)
        return !isNaN(n) && Number.isInteger(n) && n >= 0 && isNum
    },
    isValidAddress: (address: any): boolean => address && web3Utils.isHexStrict(address) && web3Utils.isAddress(address),
    toCheckSum: (value: string) => {
        return value ? (value.length === 42 ? web3Utils.toChecksumAddress(value) : value) : ''
    }
}

export { eth }
