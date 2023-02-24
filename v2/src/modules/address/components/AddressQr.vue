<template>
    <div class="pt-4">
        <div class="d-flex align-center">
            <app-address-blockie :address="props.address" :size="8" key="identicon" class="mr-2" />
            <p class="font-weight-bold">{{ name }}</p>
            <v-spacer />
            <app-copy-to-clip :value-to-copy="props.address" />
        </div>
        <div class="d-flex align-center">
            <vue-qr v :text="props.address" :size="140" />
            <p class="text-break-new-line font-mono">{{ eth.toCheckSum(props.address) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import { eth } from '@/core/helper/eth'

interface PropType {
    address: string
    name?: string
}

const props = defineProps<PropType>()

/*
===================================================================================
  Computed Values
===================================================================================
*/

const name = computed<string>(() => {
    return props.name ? props.name : 'No Name'
})
</script>
