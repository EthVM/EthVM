import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export function useAppNavigation() {
    const supportsFiat = true
    const { t } = useI18n()

    /**
     *
     * Nav Items
     */
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
    interface NavMenuEntry {
        header: NavHeader
        links?: NavLink[]
    }

    const { mdAndDown } = useDisplay()

    const navItems = computed<NavMenuEntry[]>(() => {
        const items = [
            {
                header: {
                    text: t('coreMenu.home'),
                    routerLink: 'https://www.ethvm.com/'
                }
            },
            {
                header: {
                    text: t('coreMenu.blockchain')
                },
                links: [
                    {
                        text: t('common.block', 2),
                        routerLink: 'https://www.ethvm.com/blocks'
                    },
                    {
                        text: t('txs.name', 2),
                        routerLink: 'https://www.ethvm.com/txs'
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
                        img: '~/assets/logo/mew.svg',
                        imgClass: 'pa-1',
                        isExternal: true
                    },
                    {
                        text: 'MEW wallet',
                        routerLink: 'https://www.mewwallet.com/',
                        subtext: t('productDesc.mewWallet'),
                        img: '@/assets/logo/mewwallet.svg',
                        isExternal: true
                    },
                    {
                        text: 'Enkrypt',
                        routerLink: 'https://www.enkrypt.com',
                        subtext: t('productDesc.enkrypt'),
                        img: '@/assets/logo/enkrypt1.svg',
                        isExternal: true
                    },
                    {
                        text: 'MEWtopia',
                        routerLink: 'https://www.mewtopia.com/',
                        subtext: t('productDesc.mewtopia'),
                        img: '@/assets/logo/mewtopia.svg',
                        imgClass: 'pa-2',
                        isExternal: true
                    },
                    {
                        text: t('home.footer.help'),
                        routerLink: 'https://help.myetherwallet.com/',
                        subtext: t('productDesc.helpCenter'),
                        img: '@/assets/logo/help-center.svg',
                        imgClass: 'pa-2',
                        isExternal: true
                    }
                ]
            },
            {
                header: {
                    text: t('portfolio.yourPortfolio'),
                    icon: 'folder_special',
                    routerLink: 'https://www.ethvm.com/portfolio?t=address-list'
                }
            }
        ]
        if (supportsFiat) {
            items.splice(1, 0, {
                header: {
                    text: t('common.token', 2),
                    routerLink: 'https://www.ethvm.com/tokens?t=all'
                }
            })
        }
        if (mdAndDown.value) {
            items.push({
                header: {
                    text: t('home.footer.settings'),
                    icon: 'settings',
                    routerLink: 'https://www.ethvm.com/settings'
                }
            })
        }
        return items
    })
    return {
        navItems
    }
}
