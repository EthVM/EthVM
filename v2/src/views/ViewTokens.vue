<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <module-big-movers />
        </v-col>
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
import ModuleBigMovers from '@/modules/tokens/ModuleBigMovers.vue'
import ModuleTokensInfo from '@module/tokens/ModuleTokensInfo.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { tabViewRouteGuardOnUpdate } from '@/core/router/helpers'
import { Q_TOKENS } from '@/core/router/routesNames'
import { useHead } from '@unhead/vue'
import { VIEW_TAGS } from '@core/helper/tags'

useHead({
    title: VIEW_TAGS.TOKENS.title
})
onMounted(() => {
    window.scrollTo(0, 0)
})
const { columnPadding, rowMargin } = useAppViewGrid()

const props = defineProps({
    tab: String
})

onBeforeRouteUpdate(async (to, from, next) => {
    tabViewRouteGuardOnUpdate(Q_TOKENS[0], to, from, next)
})
</script>

<style scoped></style>
