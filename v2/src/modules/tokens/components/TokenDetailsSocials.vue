<template>
    <div>
        <div>
            <p class="mb-2" :class="labelTitleClass">Contract</p>
            <div class="d-flex align-center">
                <template v-if="!props.isLoading && tokenDetails">
                    <app-address-blockie :address="eth.toCheckSum(props.tokenDetails.contract) || ''" :size="8" class="mr-1 mr-md-2" />
                    <app-transform-hash
                        :is-short="smAndDown"
                        is-blue
                        :hash="eth.toCheckSum(props.tokenDetails.contract)"
                        class="w-100"
                        :link="`/address/${props.tokenDetails.contract}`"
                    />
                </template>
                <div v-else class="skeleton-box rounded-xl" style="height: 20px"></div>
            </div>
        </div>
        <v-row class="mt-4 mb-0">
            <v-col cols="4" class="py-0">
                <p class="mb-1" :class="labelTitleClass">Token Standard</p>
                <p>{{ props.isNft ? 'ERC721' : 'ERC20' }}</p>
            </v-col>
            <v-col cols="4" class="py-0">
                <p class="mb-1" :class="labelTitleClass">Decimals</p>
                <p v-if="!props.isLoading && tokenDetails">{{ props.tokenDetails.decimals }}</p>
                <div v-else class="skeleton-box rounded-xl" style="height: 20px"></div>
            </v-col>
        </v-row>
        <div class="mt-4">
            <p class="mb-1" :class="labelTitleClass">Official website</p>
            <a href="google.com" target="_blank" class="text-secondary">www.google.com</a>
        </div>
        <div class="mt-4">
            <p class="mb-1" :class="labelTitleClass">Website and socials</p>
            <div class="d-flex">
                <a href="google.com" target="_blank" class="text-info mr-2">
                    <v-icon>email</v-icon>
                </a>
                <a href="google.com" target="_blank" class="text-info mr-2">
                    <v-icon>reddit</v-icon>
                </a>
                <a href="google.com" target="_blank" class="text-info mr-2">
                    <v-icon>facebook</v-icon>
                </a>
                <a href="google.com" target="_blank" class="text-info mr-2">
                    <v-icon>mdi_twitter</v-icon>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { GetTokenInfoByContractQuery as TokenInfo } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { eth } from '@core/helper'
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { smAndDown } = useDisplay()

interface PropType {
    tokenDetails: TokenInfo
    isNft: boolean
    isLoading: boolean
}

const props = defineProps<PropType>()

const labelTitleClass = computed<string>(() => {
    return smAndDown ? 'text-info text-subtitle-2 font-weight-regular' : 'text-body-1 font-weight-bold'
})
</script>
