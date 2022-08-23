<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl">
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})
const { columnPadding, rowMargin } = useAppViewGrid()
</script>
