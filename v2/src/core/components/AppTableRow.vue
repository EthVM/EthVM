<template>
    <v-card flat class="mx-n6 rounded-0 py-1 position-relative" v-bind="$attrs">
        <v-row class="text-body-1 my-0 flex-row mx-4" :align="rowAlign">
            <slot />
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ComponentProps {
    align: string
}
const props = defineProps<ComponentProps>()

const rowAlign = computed<string>(() => {
    return props.align || 'center'
})
</script>

<style lang="scss"></style>
