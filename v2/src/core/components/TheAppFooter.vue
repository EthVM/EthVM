<template>
    <v-footer flat color="primary" class="pa-0 flex-column">
        <v-container class="footer px-0 mx-2 mx-sm-6">
            <div class="px-4 px-sm-6">
                <v-row justify="space-between" justify-lg="center" class="flex-column flex-sm-row mx-0">
                    <v-col cols="12" sm="6" md="4" lg="2" class="position-relative">
                        <router-link to="/">
                            <v-img :src="require('@/assets/logo.svg')" height="35" :width="xs ? '80' : '100'" contain />
                        </router-link>
                        <v-img
                            :src="require('@/assets/footer-hero.png')"
                            width="260"
                            aspect-ratio="1"
                            cover
                            class="footer-hero"
                            :class="{ 'footer-hero-lg': !mdAndDown }"
                        />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="2">
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
                            <li class="mb-2">
                                <a href="#" class="text-link">Tools</a>
                            </li>
                            <li class="mb-2">
                                <div class="d-flex">
                                    <a href="https://twitter.com/Eth_VM" class="text-link">
                                        <v-icon>facebook</v-icon>
                                    </a>
                                    <a href="https://twitter.com/Eth_VM" class="text-link">
                                        <v-icon>youtube</v-icon>
                                    </a>
                                    <a href="https://twitter.com/Eth_VM" class="text-link">
                                        <v-icon>twitter</v-icon>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="4">
                        <p class="footer-item-title text-h5 font-weight-bold mb-2">Love ethVM</p>
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
                    <v-col cols="12" sm="6" md="4" lg="2">
                        <p class="footer-item-title text-h5 font-weight-bold mb-2">Settings</p>
                        <p class="mb-3">Pricing from Coingecko</p>
                        <div class="d-flex font-weight-light align-center">
                            <p class="text-uppercase mb-0 mr-2 text-caption font-weight-light">Powered by</p>
                            <div class="d-flex align-center">
                                <v-img :src="require('@/assets/logo/mew.svg')" width="24" height="24" contain class="mr-1" />
                                <p class="text-uppercase text-h3">MEW</p>
                            </div>
                        </div>
                    </v-col>
                    <!--                    <v-col cols="8">-->
                    <!--                        <v-row class="flex-column flex-md-row mx-0">-->
                    <!--                        </v-row>-->
                    <!--                    </v-col>-->
                </v-row>
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
import { useDisplay } from 'vuetify/lib/framework.mjs'
/* Vuetify BreakPoints */
const { xs, mdAndDown } = useDisplay()
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
    &-lg {
        overflow: visible;
        position: absolute;
        left: -50px;
        margin-top: 30px;
        max-width: 300px;
        max-height: 300px;
    }
}
</style>
