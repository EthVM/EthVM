export const DEFAULT_NETWORK = 'MAINNET'
const SUPPORTED_NETWORKS = [DEFAULT_NETWORK, 'SEPOLIA']

export const isSupportedNetwork = (_network: string): boolean => {
    return SUPPORTED_NETWORKS.includes(_network)
}

export interface NetworkType {
    name: string
    curr: string
    support_fiat: boolean
    support_nft: boolean
    coingecko_id?: string
    nft_id?: string
    ens_id?: string
    unstoppable_id?: string
}
interface NetworksInterface {
    [key: string]: NetworkType
}

export const NETWORKS: NetworksInterface = {
    [DEFAULT_NETWORK]: {
        name: 'Ethereum Mainnet',
        curr: 'ETH',
        support_fiat: true,
        support_nft: true,
        coingecko_id: 'ethereum',
        nft_id: 'ethereum',
        ens_id: 'ETH',
        unstoppable_id: 'ETH'
    },
    SEPOLIA: {
        name: 'Sepolia Testnet',
        curr: 'SEP',
        support_fiat: false,
        support_nft: false
    }
}
