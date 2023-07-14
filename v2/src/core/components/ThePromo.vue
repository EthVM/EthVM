<template>
    <v-snackbar
        v-if="store.showPopUp && !store.notification"
        v-model="state.showPopup"
        location="bottom right"
        color="snackbar"
        content-class="break-string"
        :timeout="-1"
        transition="slide-y-reverse-transition"
        mode="in-out"
        rounded="lg"
        :close-on-back="false"
    >
        <!--
            Change below content to display different message in case of promo
        -->
        <v-row align="center" justify="start" class="pa-4 pa-sm-6 flex-sm-nowrap ma-n3" no-gutters>
            <v-col cols="10" sm="auto" order="1" class="flex-shrink-1 flex-grow-0">
                <p class="text-body-1">Help us make an awesome user friendly product</p>
            </v-col>
            <v-col cols="auto" order="3" orde-sm="2">
                <v-btn
                    text="Take a quick survey"
                    min-width="186"
                    height="40px"
                    color="secondary"
                    rounded="pill"
                    variant="flat"
                    class="mt-5 mt-sm-0 ml-sm-5 mr-sm-3"
                    href="https://mewwallet.typeform.com/ethvm"
                    target="_blank"
                ></v-btn>
            </v-col>
            <v-col cols="2" sm="auto" order="2" order-sm="3" class="d-flex align-center justify-end d-sm-block">
                <v-btn icon height="34px" width="34px" color="snackbar" variant="flat" @click.stop="closePopUp()">
                    <v-icon icon="close" class="white--text" size="22px"></v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-snackbar>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'
import { useTimeoutFn } from '@vueuse/core'

const store = useStore()

interface StateType {
    showPopup: boolean
}
const state = reactive<StateType>({
    showPopup: false
})

const { start, stop } = useTimeoutFn(() => {
    state.showPopup = true
}, 5000)

stop()

watch(
    () => store.showPopUp,
    newVal => {
        if (newVal === undefined) {
            state.showPopup = false
            stop()
        } else {
            if (store.showPopUp) {
                start()
            } else {
                stop()
            }
        }
    }
)

/**
 * Shows promo popup on mounted
 * NOTE: promo will be hidden while store notification is active
 */
onMounted(() => {
    if (store.showPopUp) {
        start()
    }
})

onBeforeUnmount(() => {
    stop()
})

const closePopUp = () => {
    store.setPopup(false)
    state.showPopup = false
}
</script>
<style lang="scss">
.v-snackbar__wrapper {
    border-bottom: 3px solid rgb(var(--v-theme-secondary));
    min-width: 300px;
}
</style>
