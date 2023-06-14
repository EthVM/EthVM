interface Route {
    [key: string]: {
        NAME: string
        PATH: string
    }
}
interface RouteProp {
    [key: string]: string
}
const ROUTE_PROP: RouteProp = {
    BLOCK: 'blockRef',
    UNCLE: 'uncleRef',
    TX: 'txRef',
    ADDRESS: 'addressRef',
    CHART: 'chartRef',
    TOKEN: 'addressRef',
    SEARCH_NOT_FOUND: ':searchTerm'
}
const ROUTE_NAME: Route = {
    HOME: { NAME: 'Home', PATH: '/' },
    BLOCKS: {
        PATH: '/blocks',
        NAME: 'blocks'
    },
    // ALL_BLOCKS_AND_TXS: {
    //     PATH: '/eth',
    //     NAME: 'allBlocks'
    // },
    BLOCK_NUMBER: {
        PATH: `/block/number/:${ROUTE_PROP.BLOCK}`,
        NAME: 'block'
    },
    BLOCK_HASH: {
        PATH: `/block/hash/:${ROUTE_PROP.BLOCK}`,
        NAME: 'blockHash'
    },
    UNCLE_HASH: {
        PATH: `/uncle/:${ROUTE_PROP.UNCLE}`,
        NAME: 'uncleHash'
    },
    TXS: {
        PATH: '/txs',
        NAME: 'transactions'
    },
    TX_HASH: {
        PATH: `/tx/:${ROUTE_PROP.TX}`,
        NAME: 'transaction'
    },
    TXS_PENDING: {
        PATH: '/pending-txs',
        NAME: 'pending'
    },
    ADDRESS: {
        PATH: `/address/:${ROUTE_PROP.ADDRESS}`,
        NAME: 'address'
    },
    ADDRESS_BALANCE: {
        PATH: 'adr-eth-balance-and-history',
        NAME: 'address-balance'
    },
    ADDRESS_TOKENS: {
        PATH: 'adr-tokens',
        NAME: 'address-tokens'
    },
    ADDRESS_NFTS: {
        PATH: 'adr-nfts',
        NAME: 'address-nfts'
    },

    CHARTS: {
        PATH: '/charts',
        NAME: 'charts'
    },
    CHART: {
        PATH: `/chart/:${ROUTE_PROP.CHART}`,
        NAME: 'chart-detail'
    },
    TOKEN: {
        PATH: `/token/:${ROUTE_PROP.TOKEN}`,
        NAME: 'token-detail'
    },
    TOKENS: {
        PATH: '/tokens',
        NAME: 'tokens'
    },
    ABOUT: {
        PATH: '/about',
        NAME: 'about'
    },
    NOT_FOUND: {
        PATH: '/404',
        NAME: 'not_found'
    },
    PORTFOLIO: {
        PATH: '/portfolio',
        NAME: 'portfolio'
    },
    SETTINGS: {
        PATH: '/settings',
        NAME: 'settings'
    },
    ADVERTISE: {
        PATH: '/advertise-with-us',
        NAME: 'advertise'
    },
    PRIVACY_POLICY: {
        PATH: '/privacy-policy',
        NAME: 'privacypolicy'
    }
}

const ADDRESS_ROUTE_QUERY = {
    Q_NFTS: ['collection', 'transfers'],
    Q_TOKENS: ['balance', 'transfers'],
    Q_MINER: ['blocks', 'uncles']
}
const Q_PORTFOLIO = ['address-list', 'balances']
const Q_TOKEN_DETAILS = ['transfers', 'holders']
const Q_BLOCKS_AND_TXS = ['blocks', 'transactions']
const Q_BLOCK_DETAILS = ['transaction', 'stake-withdrawals', 'more']
const Q_ADDRESS_TRANSFERS = ['all', 'internal', 'tx-history', 'pending', 'rewards', 'stake-withdrawals']
const Q_TXS_DETAILS = ['state', 'other', 'actions', 'logs']

export { ROUTE_NAME, ROUTE_PROP, ADDRESS_ROUTE_QUERY, Q_TOKEN_DETAILS, Q_BLOCKS_AND_TXS, Q_BLOCK_DETAILS, Q_TXS_DETAILS, Q_ADDRESS_TRANSFERS, Q_PORTFOLIO }
