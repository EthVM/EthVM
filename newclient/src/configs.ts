
const configs = {
    APOLLO_HTTP: 'https://baghkyu21b.execute-api.us-west-2.amazonaws.com/dev/',
    APOLLO_WS: 'wss://baghkyu21b.execute-api.us-west-2.amazonaws.com/dev',
    OPENSEA: process.env.VUE_APP_OPENSEA_API || '',
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
    ROUTER_MODE: process.env.ROUTER_MODE || 'history'
}
export default configs
