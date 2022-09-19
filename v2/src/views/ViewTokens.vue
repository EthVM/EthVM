<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <module-tokens-info />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleTokensInfo from '@module/tokens/ModuleTokensInfo'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()
</script>

<style scoped></style>
