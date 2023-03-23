<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <p>Settings</p>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'

onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
