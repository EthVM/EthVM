<template>
    <div>
        <div class="nebula px-2 px-sm-6 mx-xl-auto mt-n16 pt-16">
            <v-container :class="['px-7 px-lg-12 pt-5 pt-lg-0 pb-16']">
                <v-row align="center" justify="space-between" class="flex-column flex-lg-row">
                    <v-img v-if="mdAndDown" :src="require('@/assets/hero/hero.png')" alt="" height="300" width="300" max-height="300" max-width="300" contain />
                    <div class="pl-lg-14 pb-10 pb-sm-16 pb-lg-0">
                        <p class="mt-lg-16 text-white font-weight-light text-h3 text-sm-h2 text-lg-h1 text-center text-lg-left">Track, analyze and explore</p>
                        <p class="text-white font-weight-light text-h3 text-sm-h2 text-lg-h1 text-center text-lg-left">on the Ethereum blockchain.</p>
                        <div class="ml-1">
                            <module-search class="justify-center justify-lg-start mt-5 mt-lg-10" />
                        </div>
                    </div>
                    <v-img
                        v-if="lgAndUp"
                        :src="require('@/assets/hero/hero-group.png')"
                        alt=""
                        min-height="460"
                        min-width="460"
                        max-height="460"
                        max-width="460"
                        class="mt-10"
                        contain
                    />
                </v-row>
            </v-container>
        </div>
        <div class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="pt-3 px-0">
                <v-row :class="rowMargin">
                    <v-col cols="12" :class="columnPadding">
                        <block-stats-module />
                    </v-col>
                    <v-col v-if="showPortfolio" cols="12" :class="columnPadding">
                        <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                            <v-card-title class="px-0 d-flex align-center justify-space-between px-4 px-sm-6 py-0 mb-4">
                                <p class="text-h6 font-weight-bold text-capitalize">Your portfolio</p>
                                <app-btn v-if="!xs" text="More" isSmall icon="east" @click="goToPortfolio"></app-btn>
                                <app-btn-icon v-else icon="east" @click="goToPortfolio"></app-btn-icon>
                            </v-card-title>
                            <module-portfolio-list /> </v-card
                    ></v-col>
                    <v-col cols="12" lg="6" :class="columnPadding">
                        <module-tokens-info :home-page="TOKENS_VIEW.ALL" />
                    </v-col>
                    <v-col v-if="showFavToknes || (!showFavToknes && lgAndUp)" cols="12" lg="6" :class="columnPadding">
                        <module-tokens-info v-if="showFavToknes" :home-page="TOKENS_VIEW.FAV" />
                        <v-card
                            v-if="!showFavToknes && lgAndUp"
                            elevation="1"
                            rounded="xl"
                            class="enkrypt-promo-bg"
                            max-height="565"
                            :href="downloadEnkrypt"
                            target="_blank"
                        >
                            <v-img
                                :src="require('@/assets/promo/enkrypt-text.svg')"
                                contain
                                aspect-ratio="1"
                                height="565"
                                width="565"
                                class="enkrypt-promo-text mr-auto"
                            />
                        </v-card>
                    </v-col>
                    <v-col v-if="showFavToknes || (!showFavToknes && mdAndDown)" cols="12" sm="6" md="4" :class="columnPadding">
                        <v-card elevation="1" rounded="xl" class="enkrypt-promo-bg-sm" max-height="200" :href="downloadEnkrypt" target="_blank">
                            <v-img
                                :src="require('@/assets/promo/enkrypt-text-sm.png')"
                                contain
                                aspect-ratio="1"
                                height="150"
                                width="150"
                                class="enkrypt-promo-text-sm mr-auto"
                            />
                        </v-card>
                    </v-col>
                    <v-col v-if="showFavToknes || (!showFavToknes && mdAndDown)" cols="12" sm="6" md="8" :class="columnPadding">
                        <v-card elevation="1" rounded="xl" max-height="200" class="promo pa-4 pa-sm-6">
                            <v-row align="end" justify="space-around" class="fill-height">
                                <a class="d-flex align-center justify-center flex-column" href="https://www.myetherwallet.com/" target="_blank">
                                    <v-img :src="require('@/assets/promo/mew.png')" cover height="40" width="88" />
                                    <app-btn text="Swap Tokens"></app-btn>
                                </a>
                                <a
                                    class="d-flex align-center justify-center flex-column"
                                    href="https://ccswap1.myetherwallet.com/?platform=ethvm"
                                    target="_blank"
                                >
                                    <v-img :src="require('@/assets/promo/buy-crypto.png')" contain height="44" width="48" class="mb-2" />

                                    <app-btn text="Buy Crypto" href="https://ccswap1.myetherwallet.com/?platform=ethvm"></app-btn>
                                </a>
                                <a
                                    v-if="mdAndUp"
                                    class="d-flex align-center justify-center flex-column"
                                    href="https://rarible.com/?ref=0x5bA9576c214FC7C6649f6F3C73dcbC2769b1761"
                                    target="_blank"
                                >
                                    <v-img :src="require('@/assets/promo/rarible.png')" cover height="40" width="100" />
                                    <app-btn text="Trade NFTs"></app-btn>
                                </a>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12" :class="columnPadding">
                        <recent-blocks :max-items="10" page-type="home" />
                    </v-col>
                    <v-col cols="12" :class="columnPadding">
                        <module-txs :max-items="10" page-type="home" />
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script setup lang="ts">
// Components
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import ModuleSearch from '@/modules/search/ModuleAppSearch.vue'
import ModulePortfolioList from '@module/address/ModulePortfolioList.vue'
import ModuleTokensInfo from '@module/tokens/ModuleTokensInfo.vue'
import { TOKENS_VIEW } from '@module/tokens/models/tokensView'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from '@/store'
import { onMounted } from 'vue'
import configs from '@/configs'
const { lgAndUp, mdAndDown, mdAndUp, xs } = useDisplay()
const { columnPadding, rowMargin } = useAppViewGrid()
onMounted(() => {
    window.scrollTo(0, 0)
})

const router = useRouter()
const store = useStore()
const showPortfolio = computed<boolean>(() => {
    return store.portfolioLength > 0
})
const goToPortfolio = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.PORTFOLIO.NAME
    })
}
const showFavToknes = computed<boolean>(() => {
    return store.favTokens.length > 0
})

const detect = (): string => {
    const userAgent = navigator.userAgent

    if (userAgent.match(/^((?!chrome|android).)*safari/i)) {
        return configs.BROWSER_NAMES.safari
    } else if (userAgent.match(/Opera|OPR/i)) {
        return configs.BROWSER_NAMES.opera
    } else if (userAgent.match(/edg/i)) {
        return configs.BROWSER_NAMES.edge
    } else if (userAgent.match(/chrome|chromium|crios/i)) {
        return configs.BROWSER_NAMES.chrome
    } else if (userAgent.match(/firefox|fxios/i)) {
        return configs.BROWSER_NAMES.firefox
    }
    return ''
}
const downloadEnkrypt = computed<string>(() => {
    const browser = detect()
    switch (browser) {
        case configs.BROWSER_NAMES.chrome:
            return configs.EXTENSION_LINKS.chrome
        case configs.BROWSER_NAMES.edge:
            return configs.EXTENSION_LINKS.edge
        case configs.BROWSER_NAMES.firefox:
            return configs.EXTENSION_LINKS.firefox
        case configs.BROWSER_NAMES.opera:
            return configs.EXTENSION_LINKS.opera
        case configs.BROWSER_NAMES.safari:
            return configs.EXTENSION_LINKS.safari
        default:
            return 'https://www.enkrypt.com/'
    }
})
</script>

<style lang="scss" scoped>
.adr-core-background {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 544px, rgb(var(--v-theme-background)) 544px, rgb(var(--v-theme-background)) 100%);
}
.adr-core-background-mobile {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 466px, rgb(var(--v-theme-background)) 466px, rgb(var(--v-theme-background)) 100%);
}

.top-card-md {
    margin-bottom: 84px;
    margin-top: 205px;
}

.top-card-xs {
    margin-bottom: 84px;
    margin-top: 205px;
}

.nebula {
    @media (max-width: 599px) {
        background: url('/src/assets/nebula/nebula-bg-xs.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        background: url('/src/assets/nebula/nebula-bg-sm.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 15% center;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        background: url('/src/assets/nebula/nebula-bg-md.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 35% center;
    }
    @media (min-width: 1240px) {
        background: url('/src/assets/nebula/nebula-bg-lg.png');
        background-position: right 35% center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    background-attachment: fixed;
    height: 100%;
    width: 100;
    background-color: rgb(var(--v-theme-primary)) !important;
}

.enkrypt-promo-bg {
    top: 0;
    left: 0;
    background: url('@/assets/promo/enkrypt-screen.png'), url('/src/assets/promo/enkrypt-purple-bg.svg');
    background-size: 430px, contain;
    background-position: top 120px right 15%, right -130px bottom -60px;
    background-repeat: no-repeat, no-repeat;
    background-color: rgb(var(--v-theme-white));
}
.enkrypt-promo-bg-sm {
    background: url('@/assets/promo/enkrypt-screen.png'), url('/src/assets/promo/enkrypt-purple-bg.svg');
    background-size: 150px, 700px;
    background-position: center left 150px, left 200px center;
    background-repeat: no-repeat, no-repeat;
    background-color: rgb(var(--v-theme-white));
}

.promo {
    @media (max-width: 599px) {
        background: url('/src/assets/nebula/nebula-bg-xs.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        background: url('/src/assets/nebula/nebula-bg-sm.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 15% center;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        background: url('/src/assets/nebula/nebula-bg-md.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 35% center;
    }
    @media (min-width: 1240px) {
        background: url('/src/assets/nebula/nebula-bg-lg.png');
        background-position: right 35% center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    height: 100%;
    background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
