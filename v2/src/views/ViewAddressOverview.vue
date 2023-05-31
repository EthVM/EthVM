<template>
    <v-row :class="rowMargin">
        <v-col cols="12" lg="4" :class="columnPadding">
            <module-portfolio-total :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-address-balance :address-ref="props.addressRef" is-overview />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="[columnPadding, 'd-none d-sm-block']">
            <module-address-token-balance :address-ref="props.addressRef" />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-address-tokens is-overview :address-hash="props.addressRef" />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-address-recent-nfts :address-hash="props.addressRef" is-overview />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-address-token-transfers :address-hash="props.addressRef" :new-erc20-transfer="newErc20Transfer" @resetCount="resetCount" is-overview />
        </v-col>
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-address-nft-transfers :address-hash="props.addressRef" :new-erc721-transfer="newErc721Transfer" @resetCount="resetCount" is-overview />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <v-card-title class="d-flex justify-space-between align-center pa-0 mb-5">
                    <div>
                        <span class="text-h6 font-weight-bold">{{ currencyName }} History</span>
                    </div>
                    <app-btn v-if="!xs" text="More" isSmall icon="east" @click="goToEthPage"></app-btn>
                    <app-btn-icon v-if="xs" icon="east" @click="goToEthPage"></app-btn-icon>
                </v-card-title>
                <module-all-eth-transfers :address-ref="props.addressRef" is-overview />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModuleAddressTokenBalance from '@module/address/ModuleAddressTokenBalance.vue'
import ModulePortfolioTotal from '@/modules/address/ModulePortfolioTotal.vue'
import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
import ModuleAllEthTransfers from '@module/address/ModuleAllEthTransfers.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import ModuleAddressRecentNfts from '@/modules/address/ModuleAddressRecentNfts.vue'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import ModuleAddressNftTransfers from '@module/address/ModuleAddressNftTransfers.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useRouter } from 'vue-router'
import { Q_ADDRESS_TRANSFERS, ROUTE_NAME } from '@core/router/routesNames'
import { onMounted, watch } from 'vue'
import { useNetwork } from '@/core/composables/Network/useNetwork'
onMounted(() => {
    window.scrollTo(0, 0)
})

const { xs } = useDisplay()
const { currencyName } = useNetwork()
const props = defineProps({
    addressRef: { type: String, required: true }
})

const { columnPadding, rowMargin } = useAppViewGrid()

const { resetCount, newErc20Transfer, newErc721Transfer } = useAddressUpdate(props.addressRef)

const router = useRouter()
const goToEthPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_BALANCE.NAME,
        query: { t: Q_ADDRESS_TRANSFERS[0] }
    })
}
watch(
    () => props.addressRef,
    (newAdr, oldAdr) => {
        if (newAdr.toLowerCase() !== oldAdr.toLowerCase()) {
            window.scrollTo(0, 0)
        }
    }
)
</script>
