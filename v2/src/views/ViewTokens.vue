<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <module-tokens-info :tab="props.tab" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import ModuleTokensInfo from '@module/tokens/ModuleTokensInfo.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'

onMounted(() => {
    window.scrollTo(0, 0)
})
const { columnPadding, rowMargin } = useAppViewGrid()

const props = defineProps({
    tab: String
})
</script>

<style scoped></style>
