const configs = {
    APOLLO_HTTP: process.env.VUE_APP_HTTP_LINK || '',
    APOLLO_WS: process.env.VUE_APP_WS_CLIENT || '',
    OPENSEA: process.env.VUE_APP_OPENSEA_API || '',
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
    ROUTER_MODE: process.env.ROUTER_MODE || 'history'
}
export default configs
