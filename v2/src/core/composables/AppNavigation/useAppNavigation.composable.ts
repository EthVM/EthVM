import { reactive } from 'vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { useNetwork } from '../Network/useNetwork'
import { useI18n } from 'vue-i18n'

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

    const navItems = reactive<NavMenuEntry[]>([
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
                    subtext: 'Ethereum desktop wallet',
                    img: require('@/assets/logo/mew.svg'),
                    imgClass: 'pa-1',
                    isExternal: true
                },
                {
                    text: 'MEW wallet',
                    routerLink: 'https://www.mewwallet.com/',
                    subtext: 'IOS and Android wallet',
                    img: require('@/assets/logo/mewwallet.svg'),
                    isExternal: true
                },
                {
                    text: 'Enkrypt',
                    routerLink: 'https://www.enkrypt.com',
                    subtext: 'Multichain extension wallet',
                    img: require('@/assets/logo/enkrypt1.svg'),
                    isExternal: true
                },
                {
                    text: 'MEWtopia',
                    routerLink: 'https://www.mewtopia.com/',
                    subtext: 'Education Blog',
                    img: require('@/assets/logo/mewtopia.svg'),
                    imgClass: 'pa-2',
                    isExternal: true
                },
                {
                    text: 'Help Center',
                    routerLink: 'https://help.myetherwallet.com/',
                    subtext: 'How to use MEW products',
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
    ])

    if (supportsFiat.value) {
        navItems.splice(1, 0, {
            header: {
                text: t('common.token', 2),
                routerLink: ROUTE_NAME.TOKENS.PATH
            }
        })
    }
    const router = useRouter()
    const navigateTo = (path: string) => {
        router.push(path)
    }
    return {
        navItems,
        navigateTo
    }
}
