const eth = {
  isValidHash: (raw: any): boolean => /^0x[0-9a-fA-F]{64}$/.test(raw),
  isValidBlockNumber: (raw: any = ''): boolean => {
    const n = parseInt(raw, 10)
    return n && !isNaN(n) && n > 0
  },
  isValidAddress: (raw: any): boolean => /^0x[0-9a-fA-F]{40}$/.test(raw)
}

export { eth }
