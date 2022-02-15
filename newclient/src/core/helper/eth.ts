import web3 from 'web3'

const eth = {
    isValidHash: (raw: any): boolean => /^(0x[0-9a-fA-F]{64}|0xGENESIS_{17}[0-9a-fA-F]{40})$/.test(raw),
    isValidBlockNumber: (raw: any = ''): boolean => {
        const isNum = /^\d+$/.test(raw)
        const n = Number(raw)
        return !isNaN(n) && Number.isInteger(n) && n >= 0 && isNum
    },
    isValidAddress: (address: any): boolean => address && web3.utils.isHexStrict(address) && web3.utils.isAddress(address),
    toEthFromWei(wei) {
        return web3.utils.fromWei(wei, 'ether')
    }
}

export { eth }
