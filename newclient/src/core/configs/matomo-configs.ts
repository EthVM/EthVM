import router from '../router'
export const MatomoConfigs = {
    host: 'https://myetherwallet.matomo.cloud/',
    siteId: 5,
    trackerFileName: 'matomo',
    router: router,
    enableLinkTracking: true,
    requireConsent: true,
    trackInitialView: true,
    disableCookies: true,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 15,
    debug: process.env.NODE_ENV !== 'production'
}
