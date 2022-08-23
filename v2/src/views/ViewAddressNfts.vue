<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="py-6">
                <module-adress-nfts class="mb-4" :address-hash="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAdressNfts from '@module/address/ModuleAdressNfts.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()
const props = defineProps({
    addressRef: { type: String, required: true }
})
</script>
