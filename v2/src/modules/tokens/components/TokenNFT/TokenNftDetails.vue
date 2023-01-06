<template>
    <v-row class="mt-2 mt-sm-6 align-center align-md-start px-2 px-sm-10" :no-gutters="xs">
        <v-col cols="12" sm="6" order-sm="2">
            <v-img contain :src="imageLarge" @error="imgLoadFail" max-width="w-100" class="border-radius-default mb-4 align-end">
                <div v-if="imageLarge === require('@/assets/icon-nft.png')" class="no-image text-uppercase text-caption text-center py-2 justify-end">
                    image not available
                </div></v-img
            >
        </v-col>
        <v-col cols="12" sm="6" order-sm="1" class="py-0">
            <p v-if="props.nft.meta?.name" class="text-h4 font-weight-bold">{{ props.nft.meta?.name }}</p>
            <p v-if="props.nft.meta?.description" class="mb-1">{{ props.nft.meta?.description }}</p>
            <p class="font-weight-bold mt-3 mb-1">Contract</p>
            <div class="d-flex align-center">
                <app-address-blockie :address="props.nft.contract"></app-address-blockie>
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.nft.contract)" :link="`/address/${props.nft.contract}`" class="ml-2" />
            </div>
            <p class="font-weight-bold mt-3 mb-1">Token Standard</p>
            <p>{{ props.nft.type }}</p>
            <p class="font-weight-bold mt-3 mb-1">ID</p>
            <p class="text-break-new-line">{{ props.nft.id }}</p>
        </v-col>
        <v-col v-if="attributes.length > 0" cols="12" class="pt-0" order="last">
            <v-divider class="mt-5 mb-4"></v-divider>
            <v-row>
                <v-col v-for="(trait, index) in attributes" cols="12" sm="6" md="3" :key="index">
                    <p class="text-info mt-1">{{ trait.trait_type }}</p>
                    <p class="font-weight-bold mb-1">{{ trait.value }}</p>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { NFTDetails } from './propModel'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { eth } from '@core/helper'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()

interface PropType {
    nft: NFTDetails
}

const props = defineProps<PropType>()

interface ComponentState {
    imageExists: boolean
    showDetails: boolean
}

const state: ComponentState = reactive({
    imageExists: true,
    showDetails: false
})

/*
===================================================================================
  Methods:
===================================================================================
*/
/**
 * Image loading failed catcher
 */
const imgLoadFail = (): void => {
    state.imageExists = false
}

/*
===================================================================================
  Computed Values
===================================================================================
*/

const imageLarge = computed<string>(() => {
    if (state.imageExists) {
        if (props.nft.meta) {
            return props.nft.meta.previews.image_large_url
                ? props.nft.meta.previews.image_large_url
                : props.nft.meta.image_url
                ? props.nft.meta.image_url
                : require('@/assets/icon-nft.png')
        }
    }

    return require('@/assets/icon-nft.png')
})

const attributes = computed(() => {
    return props.nft.meta && props.nft.meta.extra_metadata && props.nft.meta.extra_metadata.attributes && props.nft.meta.extra_metadata.attributes.length > 0
        ? props.nft.meta.extra_metadata.attributes
        : []
})
</script>
<style lang="scss" scoped>
.img-clickable {
    cursor: pointer;
}
.border-radius-default {
    border-radius: 8px;
}
</style>

<style lang="scss" scoped>
.no-image {
    background-color: rgb(var(--v-theme-primary));
    color: rgba(255, 255, 255, 0.5);
    min-height: 36px;
    width: 100%;
}
</style>
