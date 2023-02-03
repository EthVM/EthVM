<template>
    <v-footer flat color="primary" class="pa-0 flex-column">
        <v-container class="footer px-0 mx-2 mx-sm-6">
            <div class="px-4 px-sm-6">
                <v-row justify="space-between" justify-lg="center" class="flex-column flex-sm-row mx-0">
                    <v-col cols="12" class="d-block d-lg-none mb-7">
                        <router-link to="/">
                            <v-img :src="require('@/assets/logo.svg')" height="25" width="80" contain />
                        </router-link>
                    </v-col>
                    <v-col cols="12" sm="7" md="6" lg="9">
                        <v-row class="flex-column flex-lg-row">
                            <v-col cols="12" lg="3" class="d-none d-lg-block">
                                <router-link to="/">
                                    <v-img :src="require('@/assets/logo.svg')" height="25" width="80" contain />
                                </router-link>
                                <v-img :src="require('@/assets/footer-hero.webp')" width="225" aspect-ratio="1" cover class="footer-hero mt-4" />
                            </v-col>
                            <v-spacer />
                            <v-col cols="12" lg="3" class="mb-11 mb-lg-0">
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
                                    <!--                                    <li class="mb-2">-->
                                    <!--                                        <a href="#" class="text-link">Tools</a>-->
                                    <!--                                    </li>-->
                                </ul>
                            </v-col>
                            <v-col cols="12" lg="5" class="mb-11 mb-lg-0">
                                <p class="footer-item-title text-h5 font-weight-bold mb-2">Love ethVM?</p>
                                <p class="footer-item-text">
                                    Help us keep ethVM free and open-source, your donations go a long way towards making that possible.
                                </p>
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
                        </v-row>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="4" md="3" lg="2" class="text-lg-right mb-11 mb-lg-0">
                        <a href="#" class="footer-item-title d-block text-h5 font-weight-bold mb-2">
                            Settings
                            <v-icon class="ml-2">settings</v-icon>
                        </a>
                        <p class="mb-3">Pricing from Coingecko</p>
                        <v-switch
                            @update:modelValue="toggleTheme"
                            v-model="isDarkMode"
                            label="Dark mode"
                            hide-details
                            color="textPrimary"
                            class="theme-toggle"
                        />
                        <div class="d-flex font-weight-light align-center justify-lg-end">
                            <p class="text-uppercase mb-0 mr-2 text-caption font-weight-light">Powered by</p>
                            <div class="d-flex align-center">
                                <v-img :src="require('@/assets/logo/mew.svg')" width="24" height="24" contain class="mr-1" />
                                <p class="text-uppercase text-h3">MEW</p>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <div class="d-flex justify-lg-end flex-wrap pa-2">
                    <a v-for="(link, index) in socialIcons" :key="index" :href="link.link" target="_blank" class="text-link">
                        <v-img :src="link.img" :alt="link.altText" width="22" height="22" class="mr-4 mb-4 mb-lg-0 mr-lg-3 text-red" />
                        <p class="d-sr-only">{{ link.srText }}</p>
                    </a>
                </div>
            </div>
        </v-container>
        <div class="copyright bg-tabActive w-100">
            <v-container class="py-2 px-0">
                <v-row justify="end" class="mx-0">
                    <div class="px-4 px-sm-6 py-6">ethVM 2.0 {{ new Date().getFullYear() }} MyEtherWallet Inc. All rights reserved.</div>
                </v-row>
            </v-container>
        </div>
    </v-footer>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import { useTheme } from 'vuetify'
import { onMounted, ref } from 'vue'
import { useStore } from '@/store'

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

onMounted(() => {
    isDarkMode.value = theme.global.name.value === 'mainnetLightTheme'
})
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
        justify-self: flex-end;
    }
}
</style>
