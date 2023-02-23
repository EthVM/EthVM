<template>
    <v-footer flat color="primary" class="pa-0 flex-column">
        <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto px-4 px-sm-6 pb-2">
            <v-row justify="space-between" class="flex-wrap">
                <v-col cols="12" lg="3" class="mb-10 mb-lg-0" order="1">
                    <router-link to="/">
                        <v-img :src="store.isDarkMode ? require('@/assets/logo-dark.svg') : require('@/assets/logo.svg')" height="25" width="80" contain />
                    </router-link>
                    <v-img
                        v-if="lgAndUp"
                        :src="require('@/assets/hero/hero-blocks.png')"
                        width="225"
                        height="225"
                        max-width="250"
                        max-height="250"
                        aspect-ratio="1"
                        contain
                        class="footer-hero mt-4"
                    />
                </v-col>
                <v-col cols="6" sm="6" lg="2" class="mb-11 mb-lg-0" order="2">
                    <p class="footer-item-title text-h5 font-weight-bold mb-2">Discover</p>
                    <ul class="footer-item-lists pa-0 surf">
                        <li class="mb-2">
                            <a href="#" class="text-link">About us</a>
                        </li>
                        <li class="mb-2">
                            <a href="#" class="text-link">Privacy Policy</a>
                        </li>
                        <li class="mb-2">
                            <a href="#" class="text-link">Knowledge Base</a>
                        </li>
                    </ul>
                </v-col>
                <v-col cols="12" sm="6" lg="3" class="mb-11 mb-lg-0" order="4" order-sm="4" order-lg="3">
                    <p class="footer-item-title text-h5 font-weight-bold mb-2">Love ethVM?</p>
                    <p class="footer-item-text">Help us keep ethVM free and open-source, your donations go a long way towards making that possible.</p>
                    <div class="mt-5">
                        <div class="mb-2">
                            <a href="#" class="d-inline-flex align-center primary--text">
                                <v-img
                                    :src="require('@/assets/icon-ethereum.svg')"
                                    alt="Ethereum symbol in circle with purple background"
                                    width="32"
                                    height="32"
                                    class="mr-3"
                                />
                                <p>Ethereum Donation</p>
                            </a>
                        </div>
                        <div>
                            <a href="#" class="d-inline-flex align-center primary--text">
                                <v-img
                                    :src="require('@/assets/icon-bitcoin.svg')"
                                    alt="Bitcoin symbol in circle with yellow background"
                                    width="32"
                                    height="32"
                                    class="mr-3"
                                />
                                <p>Bitcoin Donation</p>
                            </a>
                        </div>
                    </div>
                </v-col>

                <!-- <v-spacer></v-spacer> -->
                <v-col cols="12" sm="4" class="text-lg-right mb-11 mb-sm-0" order="5" order-sm="3" order-lg="4">
                    <!-- <a href="#" class="footer-item-title d-block text-h5 font-weight-bold mb-2 text-sm-right">
                            Settings
                            <v-icon class="ml-2">settings</v-icon>
                        </a> -->
                    <v-switch
                        @update:modelValue="toggleTheme"
                        v-model="isDarkMode"
                        :label="themeSwitchLabel"
                        hide-details
                        color="textPrimary"
                        class="theme-toggle mt-2"
                    ></v-switch>
                    <p class="mb-3 text-sm-right">Pricing from Coingecko</p>
                    <div class="d-flex font-weight-light align-center justify-sm-end">
                        <p class="text-uppercase mb-0 mr-2 text-caption font-weight-light">Powered by</p>
                        <div class="d-flex align-center">
                            <v-img :src="require('@/assets/logo/mew.svg')" width="24" height="24" contain class="mr-1" />
                            <p class="text-uppercase text-h3">MEW</p>
                        </div>
                    </div>
                </v-col>
                <v-col v-if="mdAndDown" cols="5" sm="6" order="3" order-sm="5">
                    <v-img
                        :src="require('@/assets/hero/hero-blocks.png')"
                        min-width="80"
                        min-height="80"
                        max-width="200"
                        max-height="200"
                        aspect-ratio="1"
                        contain
                        class="ml-sm-auto mr-sm-n6"
                    />
                </v-col>
                <v-col cols="12" order="6">
                    <div class="d-flex justify-lg-end flex-wrap py-2 px-n4 mb-5">
                        <a v-for="(link, index) in socialIcons" :key="index" :href="link.link" target="_blank" class="text-link">
                            <v-img :src="link.img" :alt="link.altText" width="22" height="22" class="mr-4 mb-4 mb-lg-0 mr-lg-3 text-red" />
                            <p class="d-sr-only">{{ link.srText }}</p>
                        </a>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <div class="copyright bg-tabActive w-100">
            <v-container class="py-2 px-0">
                <div class="d-flex flex-column flex-wrap">
                    <p class="px-4 px-sm-6 pt-6 text-center text-sm-right">ethVM v{{ version }} {{ new Date().getFullYear() }} MyEtherWallet Inc.</p>
                    <p class="px-4 px-sm-6 pb-6 text-center text-sm-right">All rights reserved.</p>
                </div>
            </v-container>
        </div>
    </v-footer>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from '@/store'
import { usePreferredColorScheme } from '@vueuse/core'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import configs from '@/configs'

const { lgAndUp, mdAndDown } = useDisplay()
const version = ref(configs.VERSION || '0')
const socialIcons = [
    {
        link: 'https://www.facebook.com/MyEtherWallet',
        img: require('@/assets/social-media/facebook.svg'),
        srText: 'Link to facebook',
        altText: 'Facebook icon'
    },
    {
        link: 'https://twitter.com/myetherwallet',
        img: require('@/assets/social-media/twitter.svg'),
        srText: 'Link to twitter',
        altText: 'Twitter icon'
    },
    {
        link: 'https://www.instagram.com/myetherwallet/',
        img: require('@/assets/social-media/instagram.svg'),
        srText: 'Link to instagram',
        altText: 'Instagram icon'
    },
    {
        link: 'https://www.linkedin.com/company/myetherwallet',
        img: require('@/assets/social-media/linkedin.svg'),
        srText: 'Link to linkedin',
        altText: 'Linkedin icon'
    },
    {
        link: 'https://github.com/EthVM/EthVM',
        img: require('@/assets/social-media/github.svg'),
        srText: 'Link to github',
        altText: 'Github icon'
    },
    {
        link: 'https://www.reddit.com/r/MyEtherWallet/',
        img: require('@/assets/social-media/reddit.svg'),
        srText: 'Link to reddit',
        altText: 'Reddit icon'
    },
    {
        link: 'https://www.youtube.com/channel/UCQU5QbObwmaHNEMsuX3uQKA',
        img: require('@/assets/social-media/youtube.svg'),
        srText: 'Link to youtube',
        altText: 'Youtube icon'
    },
    {
        link: 'https://medium.com/@myetherwallet',
        img: require('@/assets/social-media/medium.svg'),
        srText: 'Link to medium',
        altText: 'Medium icon'
    },
    {
        link: 'https://t.me/myetherwallet',
        img: require('@/assets/social-media/telegram.svg'),
        srText: 'Link to telegram',
        altText: 'Telegram icon'
    }
]

const theme = useTheme()
const isDarkMode = ref(false)

const store = useStore()

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'mainnetLightTheme' : 'mainnetDarkTheme'
    store.setDarkMode(theme.global.name.value)
}

const themeSwitchLabel = computed<string>(() => {
    return isDarkMode.value ? 'Dark Node On' : 'Dark Mode Off'
})

onMounted(() => {
    const preferredColor = usePreferredColorScheme()
    if (store.appTheme) {
        theme.global.name.value = store.appTheme
    } else {
        theme.global.name.value = preferredColor.value === 'dark' ? 'mainnetDarkTheme' : 'mainnetLightTheme'
        store.setDarkMode(theme.global.name.value)
    }

    isDarkMode.value = theme.global.name.value === 'mainnetDarkTheme'
})

watch(
    () => store.appTheme,
    (val: string) => {
        theme.global.name.value = val
        isDarkMode.value = theme.global.name.value === 'mainnetDarkTheme'
    }
)
</script>

<style lang="scss" scoped>
a {
    color: rgb(var(--v-theme-on-primary)) !important;
}

.footer-item-lists {
    list-style-type: none;
}

.footer-item-text {
    max-width: 280px;
    line-height: 25px;
}

.footer-hero {
    max-width: 250px;
    max-height: 250px;
}

.theme-toggle {
    :deep(.v-input__control) {
        @media (min-width: 600px) {
            justify-self: flex-end;
        }
    }

    :deep(.v-label) {
        opacity: 1;
    }
}
</style>
