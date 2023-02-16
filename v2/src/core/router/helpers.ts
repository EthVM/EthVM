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

export const loadImages = () => {
    return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const images = ['/src/assets/background-nebula.png', '/src/assets/hero/hero.png', '/src/assets/hero/hero.png', '/src/assets/hero/hero-group.png']
        images.map(i => {
            const img = new Image()
            img.src = i
        })
        next()
    }
}
