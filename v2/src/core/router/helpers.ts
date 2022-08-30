import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { ADDRESS_ROUTE_QUERY } from './routesNames'

export const addressRouteGuard = (type: string) => {
    let tab: string
    switch (type) {
        case 'token':
            tab = ADDRESS_ROUTE_QUERY.Q_TOKENS[0]
            break
        case 'miner':
            tab = ADDRESS_ROUTE_QUERY.Q_MINER[0]
            break
    }
    return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        // check if TO query exhists and valid
        if (!to.query.t) {
            // redirect the user to first tab
            to.query.t = tab
            next(to)
        } else {
            next()
        }
    }
}
