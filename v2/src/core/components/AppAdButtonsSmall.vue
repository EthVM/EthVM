<template>
    <v-row align="center" class="justify-start justify-lg-end">
        <v-col cols="auto" style="position: relative">
            <v-btn
                rounded="pill"
                elevation="0"
                :height="xs ? 22 : 30"
                :min-width="xs ? 68 : 151"
                href="https://www.myetherwallet.com/"
                target="_blank"
                class="promo-btn text-white"
            >
                <div class="d-flex flex-row flex-sm-row align-center justify-center">
                    <v-img v-if="!xs" :src="require('@/assets/logo/mew-long-white.png')" eager contain alt="MyEtherWallet button icon" height="14" width="50" />
                    <p class="font-tiny-xs ml-sm-1 text-break-new-line">Swap Assets</p>
                </div>
            </v-btn>
            <router-link :to="ROUTE_NAME.ADVERTISE.PATH" class="ad-here-link">
                <div class="font-ad-here text-info">advertise here</div>
            </router-link>
        </v-col>
        <v-col cols="auto">
            <v-btn
                rounded="pill"
                elevation="0"
                color="secondary"
                :height="xs ? 22 : 30"
                :min-width="xs ? 68 : 151"
                href="https://ccswap.myetherwallet.com/?platform=ethvm"
                target="_blank"
                class="promo-btn text-white"
            >
                <div class="d-flex flex-row flex-sm-row align-center justify-center">
                    <v-img
                        v-if="!xs"
                        :src="require('@/assets/promo/buy-crypto.png')"
                        eager
                        contain
                        alt="MEW logo button icon"
                        height="18"
                        width="20"
                        class="mt-1"
                    />
                    <p class="font-tiny-xs ml-sm-1 text-break-new-line">Buy Crypto</p>
                </div>
            </v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn
                rounded="pill"
                elevation="0"
                color="secondary"
                :height="xs ? 22 : 30"
                :min-width="xs ? 68 : 151"
                href="https://rarible.com/?ref=0x5bA9576c214FC7C6649f6F3C73dcbC2769b1761"
                target="_blank"
                class="promo-btn text-white"
            >
                <div class="d-flex flex-row flex-sm-row align-center justify-center">
                    <v-img v-if="!xs" :src="require('@/assets/promo/rarible-icon.png')" eager contain alt="MEW logo button icon" height="16" width="16" />
                    <p class="font-tiny-xs ml-sm-1 text-break-new-line">Trade NFTs</p>
                </div>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ROUTE_NAME } from '@core/router/routesNames'
const { xs } = useDisplay()
</script>
<style>
.font-tiny-xs {
    @media (max-width: 599px) {
        font-size: 9px;
    }
    font-size: 11px;
    font-weight: 400 !important;
}
.font-ad-here {
    font-size: 10px;
}
.font-ad-here:hover {
    color: rgb(var(--v-theme-secondary)) !important;
}

.ad-here-link {
    @media (max-width: 599px) {
        top: 26px;
    }
    position: absolute;
    top: 34px;
    left: 12px;
}
.promo-btn {
    background: -webkit-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -o-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -ms-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -moz-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: linear-gradient(177deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
}
</style>
