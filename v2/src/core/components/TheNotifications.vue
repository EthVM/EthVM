<template>
    <v-snackbar
        v-model="state.showNotifications"
        location="bottom right"
        multi-line
        color="snackbar"
        content-class="break-string"
        :timeout="-1"
        transition="slide-y-reverse-transition"
        mode="in-out"
        rounded="lg"
        :close-on-back="false"
    >
        <div v-if="state.notification" class="text-body-1 text-break-new-line">
            <!-- TYPE: DELETE ADDRESS -->
            <p v-if="state.notification._type === TYPES.DELETE_ADR">"{{ state.notification.name }}" was deleted from portfolio</p>
            <!-- TYPE: PLAIN -->
            <p v-if="state.notification._type === TYPES.PLAIN" class="d-flex flex-nowrap">
                {{ state.notification.text }}
            </p>
        </div>
        <template v-if="state.notification && state.notification._type === TYPES.DELETE_ADR" #actions>
            <v-btn color="secondary" variant="text" rounded="pill" @click="restoreAddress(state.notification.hash, state.notification.name)"> Undo </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
import { NotificationType, TIMEOUT, NotificationDeleteAddress, Notification } from '@/store/helpers'

const store = useStore()
const TYPES = NotificationType

interface StateType {
    showNotifications: boolean
    notification: NotificationDeleteAddress | Notification | undefined
}
const state = reactive<StateType>({
    showNotifications: false,
    notification: undefined
})

const { pause, resume, isActive } = useIntervalFn(() => {
    state.showNotifications = false
    store.clearNotification()
}, TIMEOUT)

const { isPending, start, stop } = useTimeoutFn(() => {
    state.notification = store.notification
    state.showNotifications = true
}, 500)

stop()
pause()

watch(
    () => store.notification,
    newVal => {
        if (newVal === undefined) {
            state.showNotifications = false
            if (isActive.value) {
                pause()
            }
        } else {
            state.showNotifications = false
            if (isActive.value) {
                pause()
            }
            if (isPending) {
                stop()
            }
            start()
            resume()
        }
    }
)

onMounted(() => {
    if (store.notification) {
        start()
        resume()
    }
})

onBeforeUnmount(() => {
    pause()
    stop()
})

const restoreAddress = (_hash: string, _name: string) => {
    store.addAddress(_hash, _name)
    state.showNotifications = false
    store.clearNotification()
}
</script>
<style lang="scss">
.v-snackbar__wrapper {
    border-bottom: 3px solid rgb(var(--v-theme-secondary));
}
</style>
