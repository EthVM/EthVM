<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
                <module-address-balance :address-ref="props.addressRef" />
                <module-address-transfer-history :address-ref="props.addressRef" :tab="props.tab" @tabChange="setLastViewedTab" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTransferHistory from '@module/address/ModuleAddressTransferHistory.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    tab: {
        type: String,
        required: true
    }
})
const { columnPadding, rowMargin } = useAppViewGrid()

const emit = defineEmits<{
    (e: 'tabChange', newTab: string): void
}>()
/**
 * Emits to parent to remember last visted tab
 */
const setLastViewedTab = (tab: string): void => {
    emit('tabChange', tab)
}
</script>
