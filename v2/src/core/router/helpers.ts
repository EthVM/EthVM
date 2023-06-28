import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export const tabViewRouteGuard = (tab: string) => {
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

export const tabViewRouteGuardOnUpdate = (tab: string, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // check if TO query exhists and valid
    if (!to.query.t) {
        // redirect the user to current tab or default
        to.query.t = from.query.t ? from.query.t : tab
        next(to)
    } else {
        next()
    }
}

export const loadImages = () => {
    return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const images = [
            require('@/assets/nebula/nebula-bg-lg.png'),
            require('@/assets/hero/hero.png'),
            require('@/assets/hero/hero.png'),
            require('@/assets/hero/hero-group.png')
        ]
        images.map(i => {
            const img = new Image()
            img.src = i
        })
        next()
    }
}
