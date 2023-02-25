const BROWSER_NAMES = {
    chrome: 'chrome',
    firefox: 'firefox',
    brave: 'brave',
    edge: 'edge',
    opera: 'opera',
    safari: 'safari'
}
const EXTENSION_LINKS = {
    chrome: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
    brave: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/gfenajajnjjmmdojhdjmnngomkhlnfjl',
    opera: 'https://addons.opera.com/en/extensions/details/enkrypt/',
    safari: 'https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309'
}

const configs = {
    APOLLO_HTTP: process.env.VUE_APP_HTTP_LINK || '',
    APOLLO_WS: process.env.VUE_APP_WS_CLIENT || '',
    OPENSEA: process.env.VUE_APP_OPENSEA_API || '',
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
    ROUTER_MODE: process.env.VUE_APP_ROUTER_MODE || 'history',
    BROWSER_NAMES: BROWSER_NAMES,
    EXTENSION_LINKS: EXTENSION_LINKS
}
export default configs
