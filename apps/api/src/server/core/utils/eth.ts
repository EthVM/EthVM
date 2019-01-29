export const isValidAddress = (address: string): boolean => /^0x[0-9a-fA-F]{40}$/.test(address)

export const isValidHash = (hash: string): boolean => /^(0x)?([A-Fa-f0-9]{64})$/.test(hash)

export const isBuffer = (item: any, length: number = 0): boolean => Buffer.isBuffer(item) && (item as Buffer).length === length

export const hexToBuffer = (hex: string): Buffer => Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')

export const removePrefix = (hash: string): string => hash.startsWith('0x') ? hash.replace('0x', '') : hash
