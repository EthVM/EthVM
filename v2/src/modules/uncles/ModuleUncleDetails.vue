<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
        <template v-if="loading || !uncleData">
            <div class="skeleton-box rounded-xl mt-1" :style="skeletonLoaderStyle"></div>
        </template>
        <template v-else>
            <div class="d-flex align-center">
                <h1 class="text-h6 font-weight-bold">Uncle #{{ formatNumber(uncle.block.summary.number) }}</h1>
            </div>
            <span class="text-info text-body-1">
                {{ timestamp }}
            </span>
            <v-row class="my-7">
                <v-col cols="12" lg="6" class="text-textPrimary">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Miner</p>
                        <div class="d-flex align-center">
                            <app-address-blockie :address="uncle.block.summary.miner || ''" :size="8" class="mr-1 mr-sm-2" />
                            <app-transform-hash is-blue :hash="uncle.block.summary.miner" :link="`/address/${uncle.block.summary.miner}`" class="w-100" />
                        </div>
                    </div>
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Hash</p>
                        <app-transform-hash :hash="uncle.block.hash" class="w-100" />
                    </div>
                    <div class="block-info">
                        <p class="text-button mb-1">SHA3</p>
                        <app-transform-hash :hash="uncle.block.sha3Uncles" class="w-100" />
                    </div>
                </v-col>
                <v-col cols="12" lg="5" class="mt-5 mt-lg-0">
                    <div class="rounded-xl bg-tableGrey pa-5 text-textPrimary">
                        <v-row>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Included in block</p>
                                    <router-link :to="`/block/number/${uncle.parentBlockNumber}`" class="text-secondary">
                                        {{ uncle.parentBlockNumber }}
                                    </router-link>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Gas Limit</p>
                                    <p class="text-body-1 text-uppercase">{{ formatNumber(uncle.block.gasLimit) }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Gas Used</p>
                                    <p class="text-body-1">{{ formatNumber(uncle.block.gasUsed) }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Position</p>
                                    <p class="text-body-1">{{ uncle.unclePosition }}</p>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { Detail } from '@core/components/props'
import { UncleDetailsFragment as UncleDetailsType, useGetUncleByHashQuery } from './apollo/uncleDetails.generated'
import { ErrorMessageUncle } from '@module/uncles/models/ErrorMessagesForUncle'
import { excpUncleNotFound } from '@/apollo/errorExceptions'
import { computed, reactive } from 'vue'
import { formatNumber } from '@core/helper/number-format-helper'
import { timeAgo } from '@core/helper'
import { useDisplay } from 'vuetify'

const props = defineProps({
    uncleRef: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['errorDetails'])

interface ModuleState {
    hasError: boolean
}

const state: ModuleState = reactive({
    hasError: false
})

const {
    result: uncleData,
    loading: loadingUncleData,
    onError,
    onResult
} = useGetUncleByHashQuery(() => ({
    hash: props.uncleRef
}))

onResult(({ data }) => {
    if (data && data.getUncleByHash) {
        emitErrorState(false)
    }
})

onError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.toLowerCase().includes(excpUncleNotFound)) {
        emitErrorState(true, true)
    } else {
        emitErrorState(true)
    }
})

const uncle = computed<UncleDetailsType | undefined>(() => {
    return uncleData.value?.getUncleByHash
})

const uncleDetails = computed<Detail[]>(() => {
    const details: Detail[] = [
        {
            title: 'Uncle Height',
            detail: uncle.value && formatNumber(uncle.value?.block.summary.number)
        },
        {
            title: 'Uncle Position',
            detail: uncle.value?.unclePosition
        },
        {
            title: 'Hash',
            detail: uncle.value?.block.hash,
            copy: true,
            mono: true
        },
        {
            title: 'Included in Block #',
            detail: uncle.value?.parentBlockNumber,
            link: `/block/number/${uncle.value?.parentBlockNumber}`
        },
        {
            title: 'Miner',
            detail: uncle.value?.block.summary.miner,
            link: `/address/${uncle.value?.block.summary.miner}`,
            copy: true,
            mono: true,
            toChecksum: true
        },
        {
            title: 'Timestamp',
            detail: uncle.value && new Date(uncle.value?.block.summary.timestamp * 1e3).toString()
        },
        {
            title: 'SHA3',
            detail: uncle.value?.block.sha3Uncles,
            mono: true
        },
        {
            title: 'Gas Limit',
            detail: uncle.value && formatNumber(uncle.value?.block.gasLimit)
        },
        {
            title: 'Gas Used',
            detail: uncle.value && formatNumber(uncle.value?.block.gasUsed)
        }
    ]
    return details
})

const timestamp = computed<string>(() => {
    if (uncle.value) {
        const date = new Date(uncle.value?.block.summary.timestamp * 1e3).toLocaleDateString()
        const time = new Date(uncle.value?.block.summary.timestamp * 1e3).toTimeString().split('GMT')[0]
        const timeago = timeAgo(new Date(uncle.value?.block.summary.timestamp * 1e3))
        const [month, day, year] = date.split('/')
        return `${year}-${month}-${day}, ${time}, ${timeago}`
    }
    return ''
})

const loading = computed<boolean | undefined>(() => {
    return loadingUncleData.value || state.hasError
})

const { mdAndDown } = useDisplay()

const skeletonLoaderStyle = computed<string>(() => {
    if (!mdAndDown.value) {
        return 'height: 300px'
    }
    return 'height: 500px'
})

/**
 * Emit error to Sentry
 * @param val {Boolean}
 * @param hashNotFound {Boolean}
 */
const emitErrorState = (val: boolean, hashNotFound = false): void => {
    state.hasError = val
    const mess = hashNotFound ? ErrorMessageUncle.notFound : ErrorMessageUncle.details
    emit('errorDetails', state.hasError, mess)
}
</script>
