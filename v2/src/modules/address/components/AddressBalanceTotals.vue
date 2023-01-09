<template>
    <div>
        <p class="text-info text-h6">{{ props.title }}</p>
        <v-col v-if="props.isLoading" cols="6" sm="4" md="6" class="pa-0">
            <div class="skeleton-box rounded-xl mt-1" style="min-height: 24px"></div>
        </v-col>
        <p v-else class="text-h4 font-weight-bold">{{ props.balance }}</p>
        <slot name="extra"></slot>
        <v-col v-if="props.isLoading && props.subtext" cols="6" sm="4" md="6" class="pa-0">
            <div class="skeleton-box rounded-xl mt-1" style="min-height: 16px"></div>
        </v-col>
        <p v-else-if="!props.isLoading && props.subtext" class="text-info text-caption">{{ props.subtext }}</p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    subtext?: string
    isLoading: boolean
    balance: string
}
const props = defineProps<Props>()
</script>
