<template>
    <v-row :class="rowMargin">
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-address-portfolio :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-address-balance :address-ref="props.addressRef" is-overview />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-address-token-balance :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <!-- How the module can be used on the overview page -->
            <module-address-token-transfers :address-hash="props.addressRef" :new-erc20-transfer="newErc20Transfer" @resetCount="resetCount" is-overview />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <!-- How the module can be used on the overview page -->
            <module-address-miner-block
                class="mb-4"
                reward-type="block"
                is-overview
                :address-hash="props.addressRef"
                :max-items="MAX_ITEMS"
                :new-rewards="newMinedBlocks"
                @resetUpdateCount="resetCount"
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTokenBalance from '@module/address/ModuleAddressTokenBalance.vue'
import ModuleAddressPortfolio from '@/modules/address/ModuleAddressPortfolio.vue'
import ModuleAddressMinerBlock from '@module/address/ModuleAddressMinerBlock.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const MAX_ITEMS = 10

const props = defineProps({
    addressRef: { type: String, required: true }
})

const { columnPadding, rowMargin } = useAppViewGrid()

const { newMinedBlocks, resetCount, newErc20Transfer } = useAddressUpdate(props.addressRef)
</script>
