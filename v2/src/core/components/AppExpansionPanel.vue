<template>
    <v-row class="ml-6 mb-3" align="center">
        <p class="text-h6 mr-4">Eth Transfers</p>
        <app-btn-icon :icon="icon" size="default" @click="expand = !expand"></app-btn-icon>
    </v-row>
    <v-divider></v-divider>
    <v-card fluid width="auto" flat class="mx-6 mt-5">
        <p class="mb-5">Hello1</p>
        <p class="mb-5">Hello2</p>
        <p class="mb-5">Hello3</p></v-card
    >
    <v-expand-transition>
        <v-card fluid v-show="expand" width="auto" flat class="mx-6">
            <p class="mb-5">Hello4</p>
            <p class="mb-5">Hello5</p>
            <p class="mb-5">Hello6</p>
            <p class="mb-5">Hello7</p></v-card
        >
    </v-expand-transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppBtnIcon from './AppBtnIcon.vue'

const props = defineProps({
    tooltipText: {
        type: String,
        default: ''
    }
})

const expand = ref(false)
const icon = computed<string>(() => {
    return expand.value ? 'expand_less' : 'expand_more'
})
// /**
//  * PLESE USE FALLTHROUGH vue attrs from button icon:
//  * pass `icon` prop of material design, ei: icon="content_copy"
//  * you can also pass `color`, to change icon color
//  */

// const emit = defineEmits(['click'])

// /*
// ===================================================================================
//     Computed
// ===================================================================================
// */

// const btnClick = (): void => {
//     emit('click')
// }
</script>

<style lang="scss" scoped></style>
