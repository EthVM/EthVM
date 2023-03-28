<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <module-settings />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <module-address-names />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressNames from '@/modules/settings/ModuleAddressNames.vue'
import ModuleSettings from '@/modules/settings/ModuleSettings.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'

const { columnPadding, rowMargin } = useAppViewGrid()

onMounted(() => {
    window.scrollTo(0, 0)
})
</script>
