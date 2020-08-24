import web3 from 'web3'

const eth = {
    isValidHash: (raw: any): boolean => /^(0x[0-9a-fA-F]{64}|0xGENESIS_{17}[0-9a-fA-F]{40})$/.test(raw),
    isValidBlockNumber: (raw: any = ''): boolean => {
        const n = Number(raw)
        return !isNaN(n) && Number.isInteger(n) && n >= 0
    },
    isValidAddress: (raw: any): boolean => web3.utils.isAddress(raw),
    toEthFromWei(wei) {
        return web3.utils.fromWei(wei, 'ether')
    }
}

export { eth }
