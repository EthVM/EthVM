<template>
    <v-btn @click="expand = !expand" variant="text" class="ml-6 mb-5 text-h6 px-4" height="48" rounded="pill"
        >Eth Transfers<v-icon class="ml-5">{{ icon }}</v-icon></v-btn
    >
    <v-divider></v-divider>
    <v-card fluid width="auto" flat class="mx-6">
        <p>Hello1</p>
        <p>Hello2</p>
        <p>Hello3</p></v-card
    >
    <v-expand-transition>
        <v-card fluid v-show="expand" width="auto" flat class="mx-6">
            <p>Hello4</p>
            <p>Hello5</p>
            <p>Hello6</p>
            <p>Hello7</p></v-card
        >
    </v-expand-transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
