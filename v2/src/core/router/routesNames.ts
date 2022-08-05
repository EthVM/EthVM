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
    ADDRESS_CONTRACT: {
        PATH: 'adr-contract-info',
        NAME: 'address-contract-info'
    },
    ADDRESS_MINER: {
        PATH: 'adr-miner-info',
        NAME: 'address-miner-info'
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
        NAME: 'notFound'
    },
    SEARCH_NOT_FOUND: {
        PATH: `/search/not_found/:${ROUTE_PROP.SEARCH_NOT_FOUND}`,
        NAME: 'search-not-found'
    },
    FAV_ADDRESS: {
        PATH: '/fav_addresses',
        NAME: 'fav_addresses'
    },
    FAV_TOKENS: {
        PATH: '/tokens/favorites',
        NAME: 'fav_tokens'
    }
}

const ADDRESS_ROUTE_QUERY = {
    Q_NFTS: ['collection', 'transfers'],
    Q_TOKENS: ['balance', 'transfers'],
    Q_MINER: ['blocks', 'uncles']
}

export { ROUTE_NAME, ROUTE_PROP, ADDRESS_ROUTE_QUERY }
