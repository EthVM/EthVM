<template>
    <v-row :class="[rowMargin, 'my-0 my-sm-n2 my-md-n3 mx-sm-n2 mx-md-n3']">
        <v-col cols="12" sm="4" :class="sm ? 'pa-2' : columnPadding">
            <v-btn
                rounded="xl"
                elevation="1"
                block
                :min-height="xs ? 40 : sm ? 80 : 60"
                class="text-caption text-lg-body-1 promo-btn text-white"
                href="https://twitter.com/ETH_VM"
                target="_blank"
            >
                <div class="d-flex flex-row flex-sm-column flex-md-row align-center justify-center px-2">
                    <v-img :src="require('@/assets/promo/btn-twitter.png')" eager contain alt="Twitter button icon" height="30" width="30" />
                    <p class="text-caption text-lg-body-1 text-white ml-2 ml-sm-0 ml-md-2 mt-sm-1 mt-md-0 text-break-new-line">Follow us on Twitter</p>
                </div>
            </v-btn>
        </v-col>
        <v-col cols="12" sm="4" :class="sm ? 'pa-2' : columnPadding">
            <v-btn
                rounded="xl"
                elevation="1"
                block
                :min-height="xs ? 40 : sm ? 80 : 60"
                class="text-caption text-lg-body-1 promo-btn text-white"
                href="https://myetherwallet.us5.list-manage.com/subscribe/post?u=b7b388a0915a116239fcdc59d&id=7b85b410bd"
                target="_blank"
            >
                <div class="d-flex flex-row flex-sm-column flex-md-row align-center justify-center">
                    <v-img :src="require('@/assets/promo/btn-mew.png')" eager contain alt="MEW logo button icon" height="30" width="30" />
                    <p class="text-caption text-lg-body-1 text-white ml-2 ml-sm-0 ml-md-2 mt-sm-1 mt-md-0 text-break-new-line">Subscribe to our mewsletter</p>
                </div>
            </v-btn>
        </v-col>

        <v-col cols="12" sm="4" :class="sm ? 'pa-2' : columnPadding">
            <v-btn
                rounded="xl"
                elevation="1"
                block
                :min-height="xs ? 40 : sm ? 80 : 60"
                class="text-caption text-lg-body-1 promo-btn text-white"
                :href="randomHref"
                target="_blank"
            >
                <div class="d-flex flex-row flex-sm-column flex-md-row align-center justify-center">
                    <v-img :src="randomPromoImg" eager contain alt="logo button icon" :height="randomPromoImgSize.height" :width="randomPromoImgSize.width" />
                    <p class="text-caption text-lg-body-1 text-white ml-2 ml-sm-0 ml-md-2 mt-sm-1 mt-md-0 text-break-new-line">{{ randomPromoText }}</p>
                </div>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { computed, onMounted } from 'vue'
import { useStore } from '@/store'
import configs from '@/configs'
import { PROMOS } from '@/store/helpers'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { columnPadding, rowMargin } = useAppViewGrid()
const { xs, sm } = useDisplay()
const store = useStore()
/**
 * Sets random promo in the large button
 */
onMounted(() => {
    const keys = Object.keys(PROMOS)
    const random = Math.floor(Math.random() * keys.length)
    const promoKey = keys[random] as keyof typeof PROMOS
    store.setCurrentLargeBtnPromo(PROMOS[promoKey])
})

const { currentLargeButtonPromo } = storeToRefs(store)

const randomPromoImg = computed<string>(() => {
    switch (true) {
        case currentLargeButtonPromo.value === PROMOS.enkrypt:
            return require('@/assets/promo/btn-enkrypt.png')
        case currentLargeButtonPromo.value === PROMOS.mewwallet:
            return require('@/assets/promo/btn-mewwallet.png')
        default:
            return require('@/assets/promo/btn-raffle.png')
    }
})

const randomPromoText = computed<string>(() => {
    switch (true) {
        case currentLargeButtonPromo.value === PROMOS.enkrypt:
            return 'Download our browser wallet'
        case currentLargeButtonPromo.value === PROMOS.mewwallet:
            return 'Download our mobile wallet'
        default:
            return 'Win $250 in crypto'
    }
})

const randomPromoImgSize = computed(() => {
    switch (true) {
        case currentLargeButtonPromo.value === PROMOS.enkrypt:
            return {
                height: 26,
                width: 26
            }
        case currentLargeButtonPromo.value === PROMOS.mewwallet:
            return {
                height: 30,
                width: 30
            }
        default:
            return {
                height: 30,
                width: 50
            }
    }
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

const randomHref = computed<string>(() => {
    switch (true) {
        case currentLargeButtonPromo.value === PROMOS.enkrypt:
            return downloadEnkrypt.value
        case currentLargeButtonPromo.value === PROMOS.mewwallet:
            return 'https://download.mewwallet.com/'
        default:
            return 'https://raffle.enkrypt.com/'
    }
})
</script>
<style>
.promo-btn {
    background: -webkit-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -o-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -ms-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: -moz-linear-gradient(273deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
    background: linear-gradient(177deg, rgb(197, 73, 255) 0%, rgb(150, 74, 255) 81%, rgb(138, 74, 255) 100%);
}
</style>
