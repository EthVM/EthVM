<template>
    <v-card flat :color="showMoreDetails ? 'pillGrey' : 'transparent'" class="pa-4 px-sm-6">
        <div class="d-flex text-caption justify-space-between mb-2">
            <p>{{ props.index }}</p>
            <p class="text-right text-info">Log Index: {{ props.log.logIndex }}</p>
        </div>
        <v-row no-gutters class="ml-sm-6 ml-md-12 align-center flex-nowrap">
            <app-address-blockie :address="props.log.address" :size="8" key="identicon" class="mr-5" />
            <v-col cols="10">
                <p v-if="store.getAddressName(props.log.address)" class="text-ellipses mr-auto">{{ store.getAddressName(props.log.address) }}</p>
                <div class="d-flex justify-start align-center">
                    <app-transform-hash
                        :hash="eth.toCheckSum(props.log.address)"
                        :show-name="false"
                        :link="`/address/${props.log.address}`"
                        is-blue
                        :is-short="xs"
                        class="my-2"
                    />
                    <app-copy-to-clip v-if="eth.toCheckSum(props.log.address)" :value-to-copy="eth.toCheckSum(props.log.address)" class="ml-4" />
                </div>
            </v-col>
        </v-row>
        <v-row class="d-flex ml-sm-6 ml-md-12 align-end justify-space-between">
            <v-col cols="10" lg="10">
                <p v-if="props.log.signature" class="mt-2">{{ formatSignature() }}</p>
                <!-- <prism-editor  :highlight="highlighterSig" "></prism-editor> -->
                <p :class="[props.log.signature ? 'text-info text-caption mt-1' : 'mt-2', 'text-ellipses']">
                    {{ $t('txs.details.logs.signature') }}: {{ props.log.topics[0] }}
                </p>
            </v-col>
            <app-btn-icon :icon="showMoreDetails ? 'expand_less' : 'expand_more'" @click="setShowMoreDetails" />
        </v-row>
        <v-expand-transition>
            <div v-if="showMoreDetails">
                <!--
                ========================
                    Decoded
                =========================
                -->
                <!--
                ========================
                    Raw Data
                =========================
                -->
                <div class="d-flex my-2 mx-sm-3 align-center justify-start">
                    <p class="text-ellipses">{{ $t('txs.details.logs.data') }}</p>
                    <app-copy-to-clip :value-to-copy="getRawData()" class="ml-4" />
                </div>
                <prism-editor class="raw-data" v-model="rawDataPrism" :highlight="highlighterJSON" :readonly="true"></prism-editor>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import { PropType, ref } from 'vue'
import { LogFragmentFragment as Log } from '@module/txs/apollo/TxDetails/TxDetails.generated'
import { eth } from '@core/helper/eth'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
//PRISM imports
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-solidity'
import 'prismjs/themes/prism-tomorrow.min.css'

const { xs } = useDisplay()
const store = useStore()

const props = defineProps({
    log: {
        type: Object as PropType<Log>,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

const getRawData = () => {
    const topics = {}
    props.log.topics.forEach((element, index) => {
        topics[index] = element
    })
    const raw = {
        topics: topics,
        data: props.log.data
    }
    return JSON.stringify(raw, null, 2)
}
const rawDataPrism = ref()
rawDataPrism.value = getRawData()

const highlighterJSON = (data: string) => {
    return highlight(data, languages['json'])
}

const formatSignature = (): string => {
    if (props.log.signature) {
        const a = props.log.signature.replace(/[(]|[)]/g, ' $& ')
        return a.split(',').join(', ')
    }
    return ''
}

/** -------------------
 * Show More Details
 * --------------------*/
const showMoreDetails = ref(false)
const setShowMoreDetails = () => {
    showMoreDetails.value = !showMoreDetails.value
}
</script>
<style>
.raw-data {
    background: rgb(var(--v-theme-codeBG));
    color: #ccc;
    font-family: 'Source Code Pro';
    font-size: 14px;
    line-height: 1.5;
    padding: 16px;
    border-radius: 8px;
}
</style>
