<template>
    <!--
    =====================================================================================
      UNCLE DETAILS LIST
    =====================================================================================
    -->

    <app-details-list title="Uncle Details" :details="uncleDetails" :is-loading="loading" />
</template>

<script setup lang="ts">
import AppDetailsList from '@core/components/AppDetailsList.vue'
import { Detail } from '@core/components/props'
import { UncleDetailsFragment as UncleDetailsType, useGetUncleByHashQuery } from './apollo/uncleDetails.generated'
import { ErrorMessageUncle } from '@module/uncles/models/ErrorMessagesForUncle'
import { excpUncleNotFound } from '@/apollo/errorExceptions'
import { computed, reactive } from 'vue'
import { formatNumber } from '@core/helper/number-format-helper'

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

const loading = computed<boolean | undefined>(() => {
    return loadingUncleData.value || state.hasError
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
