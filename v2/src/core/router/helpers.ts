import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { ADDRESS_ROUTE_QUERY } from './routesNames'
export const addressTokensRouteGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // check if TO query exhists and valid
    if (!to.query.t) {
        // redirect the user to first tab
        to.query.t = ADDRESS_ROUTE_QUERY.Q_TOKENS[0]
        next(to)
    } else {
        next()
    }
}
export const addressMinerRouteGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // check if TO query exhists and valid
    if (!to.query.t) {
        // redirect the user to first tab
        to.query.t = ADDRESS_ROUTE_QUERY.Q_MINER[0]
        next(to)
    } else {
        next()
    }
}
