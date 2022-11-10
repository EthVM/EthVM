<template lang="html">
    <img :src="identicon" contain style="border-radius: 50%" />
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import createIcon from '@core/helper/blockies'
const props = defineProps({
    address: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 8
    }
})
/**
 * Creates and sets a blockie
 */
const identicon = ref(createIcon(props.address, { size: props.size }))

watch(
    () => props.address,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            identicon.value = createIcon(props.address, { size: props.size })
        }
    }
)

watch(
    () => props.size,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            identicon.value = createIcon(props.address, { size: props.size })
        }
    }
)
</script>

<style scoped lang="scss"></style>
