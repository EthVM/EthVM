<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <module-address-balance :address-ref="props.addressRef" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})
</script>
