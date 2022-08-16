<template>
    <div>
        <p class="text-info text-h6">{{ props.title }}</p>
        <v-col v-if="props.isLoading" cols="6" sm="4" md="6" class="pa-0">
            <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        </v-col>
        <p v-else class="text-h4 font-weight-bold">{{ props.balance }}</p>
        <slot name="extra"></slot>
        <p v-if="props.subtext" class="text-info text-caption">{{ props.subtext }}</p>
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
