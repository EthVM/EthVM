<template>
    <v-card v-if="props.txHash" variant="flat" rounded="xl" class="pa-4 pa-sm-6">
        <v-row class="mt-5"> Hello my stats sdsadada </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { TxDetailsFragment as TxDetailsType } from '../apollo/TxDetails.generated'
import { useGetTransactionStateDiffQuery } from '@module/address/apollo/AddressTransfers/transfers.generated'

interface ComponentProps {
    txHash: string
    loading: boolean
}
const props = defineProps<ComponentProps>()

const { result } = useGetTransactionStateDiffQuery(() => ({
    hash: props.txHash
}))
</script>
