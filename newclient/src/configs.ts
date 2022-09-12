const configs = {
    APOLLO_HTTP: 'https://api-v2.ethvm.dev',
    APOLLO_WS: 'wss://apiws-v2.ethvm.dev',
    OPENSEA: process.env.VUE_APP_OPENSEA_API || '',
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
    ROUTER_MODE: process.env.ROUTER_MODE || 'history'
}
export default configs
