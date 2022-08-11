import { reactive } from 'vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'

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
                routerLink: ROUTE_NAME.HOME.NAME
            }
        },
        {
            header: {
                text: 'Top Tokens',
                icon: 'insights',
                routerLink: ROUTE_NAME.TOKENS.NAME
            }
        },

        {
            header: {
                icon: 'area_chart',
                text: 'Charts',
                routerLink: ROUTE_NAME.CHARTS.NAME
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
                    routerLink: ROUTE_NAME.BLOCKS.NAME
                },
                {
                    text: 'Transaction',
                    routerLink: ROUTE_NAME.TXS.NAME
                },
                {
                    text: 'Pending Transactions',
                    routerLink: ROUTE_NAME.TXS_PENDING.NAME
                }
            ]
        },
        {
            header: {
                text: 'Watchlist',
                icon: 'favorite'
            },
            links: [
                {
                    text: 'My Addresses',
                    routerLink: ROUTE_NAME.FAV_TOKENS.NAME
                },
                {
                    text: 'My Tokens',
                    routerLink: ROUTE_NAME.FAV_ADDRESS.NAME
                }
            ]
        }
    ])
    const router = useRouter()
    const navigateTo = (name: string) => {
        router.push({
            name: name
        })
    }
    return {
        navItems,
        navigateTo
    }
}
