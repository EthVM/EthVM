<template>
    <v-row v-if="hasError" :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card :min-height="xs ? 200 : 352" elevation="1" rounded="xl" class="d-flex align-center justify-center">
                <div class="text-center px-6">
                    <p class="mb-3 font-weight-bold text-h6">{{ message }}</p>
                    <p class="text-info text-break-new-line">
                        <span><v-icon class="mr-1">info</v-icon></span> No results found for ‘{{ routeProp }}’. Please try again.
                    </p>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { xs } = useDisplay()
const { columnPadding, rowMargin } = useAppViewGrid()

defineProps({
    hasError: {
        type: Boolean
    },
    message: {
        type: String
    },
    routeProp: {
        type: String
    }
})
</script>
