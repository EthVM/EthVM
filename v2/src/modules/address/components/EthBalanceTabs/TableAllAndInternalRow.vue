<template>
    <v-row class="my-5" align="center">
        <v-col sm="2">
            <span style="width: 30px" class="d-inline-block">
                <v-icon color="success">check_circle</v-icon>
            </span>
            <span class="ml-6">0.0259500 ETH</span>
        </v-col>
        <v-col :sm="props.tab === routes[0] ? 2 : 1"> 10 seconds ago </v-col>
        <template v-if="props.tab === routes[1]">
            <v-col cols="1" class="text-center">
                <app-chip bg="warning" text="to" />
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
        </template>
        <v-col sm="2"> 0.0259500 ETH </v-col>
        <v-col sm="2"> 0.0259500 ETH </v-col>
        <template v-if="props.tab === routes[0]">
            <v-col sm="2">
                <app-chip bg="purple" text="transaction" />
            </v-col>
            <v-col sm="2">
                <div class="d-flex align-center">
                    <span class="text-info mr-2">Hash:</span>
                    <app-transform-hash
                        is-short
                        is-blue
                        :hash="eth.toCheckSum('0x09d9591442b213fe4ac9d0634023b37cc818e51c')"
                        :link="`/address/${'0x09d9591442b213fe4ac9d0634023b37cc818e51c'}`"
                    />
                </div>
            </v-col>
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
