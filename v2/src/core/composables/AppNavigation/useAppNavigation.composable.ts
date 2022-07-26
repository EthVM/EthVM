import { reactive } from 'vue'
import { ROUTE_NAME } from '@core/router/routesNames'

export function useAppNavigation() {
    /**
     * Nav Items
     */
    interface NavMenuEntry {
        header: NavHeader
        links?: NavLink[]
    }

    interface NavLink {
        text: string
        routerLink: string
    }

    interface NavHeader {
        text: string
        icon: string
        routerLink?: string
    }

    const navItems = reactive<NavMenuEntry[]>([
        {
            header: {
                icon: 'home',
                text: 'Home',
                routerLink: ROUTE_NAME.HOME.PATH
            }
        },
        {
            header: {
                icon: 'view_in_ar',
                text: 'Blockchain'
            },
            links: [
                {
                    text: 'Blocks',
                    routerLink: ROUTE_NAME.BLOCKS.PATH
                },
                {
                    text: 'Transaction',
                    routerLink: ROUTE_NAME.TXS.PATH
                },
                {
                    text: 'Pending Transactions',
                    routerLink: ROUTE_NAME.TXS_PENDING.PATH
                }
            ]
        },
        {
            header: {
                text: 'Top Tokens',
                icon: 'insights',
                routerLink: ROUTE_NAME.TOKENS.PATH
            }
        },
        {
            header: {
                text: 'Watchlist',
                icon: 'favorite'
            },
            links: [
                {
                    text: 'My Addresses',
                    routerLink: ROUTE_NAME.FAV_TOKENS.PATH
                },
                {
                    text: 'My Tokens',
                    routerLink: ROUTE_NAME.FAV_ADDRESS.PATH
                }
            ]
        },
        {
            header: {
                icon: 'area_chart',
                text: 'Charts',
                routerLink: ROUTE_NAME.CHARTS.PATH
            }
        }
    ])
    return {
        navItems
    }
}
