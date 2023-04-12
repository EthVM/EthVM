<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <module-txs :max-items="10" page-type="txs" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'

const { columnPadding, rowMargin } = useAppViewGrid()
onMounted(() => {
    window.scrollTo(0, 0)
})
</script>
