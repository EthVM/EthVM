import { computed } from 'vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { useNetwork } from '../Network/useNetwork'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export function useAppNavigation() {
    const { supportsFiat } = useNetwork()
    const { t } = useI18n()
    /**
     *
     * Nav Items
     */
    interface NavMenuEntry {
        header: NavHeader
        links?: NavLink[]
    }

    interface NavLink {
        text: string
        routerLink: string
        subtext?: string
        img?: string
        imgClass?: string
        isExternal?: boolean
    }

    interface NavHeader {
        text: string
        icon?: string
        routerLink?: string
    }

    const { mdAndDown } = useDisplay()

    const navItems = computed<NavMenuEntry[]>(() => {
        const items = [
            {
                header: {
                    text: t('coreMenu.home'),
                    routerLink: ROUTE_NAME.HOME.PATH
                }
            },
            {
                header: {
                    text: t('coreMenu.blockchain')
                },
                links: [
                    {
                        text: t('common.block', 2),
                        routerLink: ROUTE_NAME.BLOCKS.PATH
                    },
                    {
                        text: t('txs.name', 2),
                        routerLink: ROUTE_NAME.TXS.PATH
                    }
                ]
            },
            {
                header: {
                    text: `MEW ${t('coreMenu.products')}`
                },
                links: [
                    {
                        text: 'MyEtherWallet',
                        routerLink: 'https://www.myetherwallet.com/',
                        subtext: t('productDesc.mew'),
                        img: require('@/assets/logo/mew.svg'),
                        imgClass: 'pa-1',
                        isExternal: true
                    },
                    {
                        text: 'MEW wallet',
                        routerLink: 'https://www.mewwallet.com/',
                        subtext: t('productDesc.mewWallet'),
                        img: require('@/assets/logo/mewwallet.svg'),
                        isExternal: true
                    },
                    {
                        text: 'Enkrypt',
                        routerLink: 'https://www.enkrypt.com',
                        subtext: t('productDesc.enkrypt'),
                        img: require('@/assets/logo/enkrypt1.svg'),
                        isExternal: true
                    },
                    {
                        text: 'MEWtopia',
                        routerLink: 'https://www.mewtopia.com/',
                        subtext: t('productDesc.mewtopia'),
                        img: require('@/assets/logo/mewtopia.svg'),
                        imgClass: 'pa-2',
                        isExternal: true
                    },
                    {
                        text: t('home.footer.help'),
                        routerLink: 'https://help.myetherwallet.com/',
                        subtext: t('productDesc.helpCenter'),
                        img: require('@/assets/logo/help-center.svg'),
                        imgClass: 'pa-2',
                        isExternal: true
                    }
                ]
            },
            {
                header: {
                    text: t('portfolio.yourPortfolio'),
                    icon: 'folder_special',
                    routerLink: ROUTE_NAME.PORTFOLIO.PATH
                }
            }
        ]
        if (supportsFiat.value) {
            items.splice(1, 0, {
                header: {
                    text: t('common.token', 2),
                    routerLink: ROUTE_NAME.TOKENS.PATH
                }
            })
        }
        if (mdAndDown.value) {
            items.push({
                header: {
                    text: t('home.footer.settings'),
                    icon: 'settings',
                    routerLink: ROUTE_NAME.SETTINGS.PATH
                }
            })
        }
        return items
    })

    const router = useRouter()
    const navigateTo = (path: string) => {
        router.push(path)
    }
    return {
        navItems,
        navigateTo
    }
}
