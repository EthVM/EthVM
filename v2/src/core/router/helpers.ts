// import { ADDRESS_ROUTE_PROPS } from './routesNames'
// import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
// import { nextTick } from 'process'
// const addressProps = (route: typeof RouterView) => {
//     if (Object.keys(route.query).length > 0) {
//         const { type } = stripQuery(route.query)
//         const walletType = type ? type : ''
//         const overlay = route.params && route.params.overlay ? route.params.overlay : ''
//         return {
//             overlay: overlay,
//             type: walletType
//         }
//     }
// }
// export const addressRouteGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
//     if (to.params ) {
//         // redirect the user to the login page
//         return { name: 'Login' }
//     }
//     next()
// }

// export {addressProps, addressRouteGuard}
