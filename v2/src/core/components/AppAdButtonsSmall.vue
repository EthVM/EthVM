<template>
    <v-row align="center" class="justify-center justify-sm-end">
        <v-col cols="auto">
            <v-btn
                rounded="pill"
                elevation="0"
                color="secondary"
                :height="xs ? 22 : 30"
                :min-width="xs ? 68 : 151"
                href="https://www.myetherwallet.com/"
                target="_blank"
            >
                <div class="d-flex flex-row flex-sm-row align-center justify-center">
                    <v-img v-if="!xs" :src="require('@/assets/logo/mew-long-white.png')" eager contain alt="MyEtherWallet button icon" height="14" width="50" />
                    <p class="font-tiny-xs ml-sm-1 text-break-new-line">Swap Assets</p>
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
                href="https://ccswap.myetherwallet.com/?platform=ethvm"
                target="_blank"
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
</style>
