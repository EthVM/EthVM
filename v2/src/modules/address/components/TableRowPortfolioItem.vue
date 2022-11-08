<template>
    <v-card :color="state.showMore && xs ? 'pillGrey' : 'transparent'" rounded="0" flat class="mx-n5 px-5 py-2" :link="xs" @click="openMoreInfo">
        <v-row :dense="xs" class="d-flex align-center jusify-start text-body-1 mt-0 mb-1" :justify="xs ? 'end' : 'start'">
            <v-col cols="12" sm="6" lg="3" :class="['py-0 d-flex align-center justify-start', { 'mb-5': state.showMore }]">
                <app-address-blockie :address="props.adr.hash" class="mr-4" />
                <div>
                    <p v-if="mdAndDown" :style="!xs ? 'width: 120px;' : ''">{{ props.adr.name }}</p>
                    <app-transform-hash v-if="!xs" :hash="eth.toCheckSum(props.adr.hash)" :link="`address/${props.adr.hash}`" is-blue is-short class="" />
                    <div v-else>
                        <p v-if="props.adr.total" class="">{{ props.adr.total }}</p>
                        <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
                    </div>
                </div>
                <v-spacer v-if="xs" />
                <app-copy-to-clip :value-to-copy="eth.toCheckSum(props.adr.hash)" class="ml-2" />
                <app-btn-icon icon="more_vert" :id="`list-item-menu-${props.adr.hash}`"> </app-btn-icon>
            </v-col>
            <!--
                NAME:
                hidden on xs-md
            -->
            <v-col lg="3" class="py-0 d-none d-lg-flex align-center">
                <p>{{ props.adr.name }}</p>
            </v-col>
            <!--
                ETH Balance:
                hidden on xs & !state.showMore
            -->
            <v-col v-if="(xs && state.showMore) || smAndUp" cols="6" sm="3" lg="2" class="py-0 d-block d-lg-flex align-lg-center">
                <div v-if="props.adr.eth">
                    <p v-if="xs" class="text-info mb-2">ETH Balance</p>
                    <p>{{ props.adr.eth }}</p>
                    <p v-if="!xs && mdAndDown" class="text-info">{{ props.adr.ethUSD }}</p>
                </div>
                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
            </v-col>
            <!--
                ETH Value:
                hidden on (xs & !state.showMore) and SM, MD
             -->
            <v-col v-if="(xs && state.showMore) || lgAndUp" cols="6" lg="2" class="py-0 d-block d-lg-flex align-lg-center">
                <p v-if="xs" class="text-info mb-2">ETH Value</p>
                <p v-if="props.adr.ethUSD">{{ props.adr.ethUSD }}</p>
                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
            </v-col>
            <!--
                Total:
                hidden on xs
            -->
            <v-col sm="3" lg="2" class="py-0 d-none d-sm-flex align-lg-center">
                <p v-if="props.adr.total" class="mb-5 mb-lg-0">{{ props.adr.total }}</p>
                <div v-else class="skeleton-box rounded-xl" style="height: 20px; width: 60%"></div>
            </v-col>
            <!--
                Hash Value:
                hidden on (xs & ! state.showMore) and smAndUP
            -->
            <v-col v-if="xs && state.showMore" cols="12" class="pt-5 d-block">
                <p class="text-info mb-2">Hash</p>
                <app-transform-hash :hash="eth.toCheckSum(props.adr.hash)" :link="`address/${props.adr.hash}`" is-blue is-short />
            </v-col>
        </v-row>
        <app-menu min-width="180" :activator="`#list-item-menu-${props.adr.hash}`">
            <v-list-item title="Edit Name" class="py-2" @click="openEditDialog(true)"> </v-list-item>
            <v-list-item title="View Tokens" class="py-2"> </v-list-item>
            <v-divider class="my-1 mx-4" />
            <!-- <v-list-item title="Delete Address" class="py-2" @click="console.log('delete')"> </v-list-item> -->
        </app-menu>
        <module-porfolio-handle-adr v-if="state.showEdit" is-edit-mode :address="props.adr.hash" :name="props.adr.name" @close-module="openEditDialog(false)">
        </module-porfolio-handle-adr>
    </v-card>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import ModulePorfolioHandleAdr from '../ModulePorfolioHandleAdr.vue'

import AppMenu from '@core/components/AppMenu.vue'
import { reactive } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import BN from 'bignumber.js'
import { eth } from '@core/helper/eth'

const { xs, mdAndDown, smAndUp, lgAndUp } = useDisplay()

interface DisplayItem {
    name: string
    hash: string
    eth?: string
    ethUSD?: string
    total?: string
    weiBN?: BN
    ethUSDBN?: BN
    totalBN?: BN
}

interface PropsType {
    adr: DisplayItem
}
const props = defineProps<PropsType>()

const state = reactive({
    showMore: false,
    showEdit: false
})

const openMoreInfo = () => {
    if (xs.value) {
        state.showMore = !state.showMore
    }
}

const openEditDialog = (_value: boolean) => {
    state.showEdit = _value
}
</script>
