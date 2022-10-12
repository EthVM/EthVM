<template>
    <v-row class="my-5">
        <v-col sm="2">
            <span class="mr-6">
                <v-icon v-if="props.tab === routes[2]" color="success">check_circle</v-icon>
                <v-icon v-else>update</v-icon>
            </span>
            <span>0.0259500 ETH</span>
        </v-col>
        <v-col sm="2"> 10 seconds ago </v-col>
        <v-col sm="2">
            <app-chip bg="success" text="from" />
        </v-col>
        <v-col sm="2">
            <div class="d-flex align-center">
                <app-address-blockie :address="'0x09d9591442b213fe4ac9d0634023b37cc818e51c' || ''" :size="8" class="mr-2 mr-sm-2" />
                <app-transform-hash
                    is-short
                    is-blue
                    :hash="eth.toCheckSum('0x09d9591442b213fe4ac9d0634023b37cc818e51c')"
                    :link="`/address/${'0x09d9591442b213fe4ac9d0634023b37cc818e51c'}`"
                />
            </div>
        </v-col>
        <v-col sm="2">
            <app-transform-hash
                is-short
                is-blue
                :hash="eth.toCheckSum('0x09d9591442b213fe4ac9d0634023b37cc818e51c')"
                :link="`/address/${'0x09d9591442b213fe4ac9d0634023b37cc818e51c'}`"
            />
        </v-col>
        <template v-if="props.tab === routes[2]">
            <v-col sm="2">
                <div class="d-flex justify-space-between">
                    <span>0.0259500 ETH</span>
                    <span>
                        <app-btn-icon icon="expand_more" />
                    </span>
                </div>
            </v-col>
        </template>
        <template v-else>
            <v-col sm="2">0.0259500 ETH</v-col>
        </template>
    </v-row>
</template>

<script setup lang="ts">
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import { Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { eth } from '@core/helper'

const routes = Q_ADDRESS_TRANSFERS

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})
</script>
