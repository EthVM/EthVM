<template>
    <div>
        <v-row v-if="!props.loading" align="center" justify="start" class="mt-1 mb-1 mx-0 py-3">
            <!-- Previous Block -->
            <v-col xs="2" sm="1">
                <v-row v-if="props.prevBlock != ''" align="center" justify="start">
                    <v-btn :to="props.prevBlock" variant="text" color="secondary" class="black--text" icon @click="reload()">
                        <v-icon>chevron_left</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
            <!-- Title -->
            <v-col xs="8" sm="10" class="pl-0 pr-0">
                <v-row align="start" justify="start" class="mx-0">
                    <v-col xs="12">
                        <v-row row wrap align="center" justify="start">
                            <v-card-title class="title font-weight-bold py-1 pl-1">Block #{{ blockNumber }} </v-card-title>
                            <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" variant="outlined" round color="primary" class="text-capitalize mx-0" small>
                                        Uncles
                                        <v-icon>chevron_right</v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="title font-weight-bold">Uncles:</v-card-title>
                                    <v-divider class="lineGrey" />
                                    <v-list>
                                        <v-list-item v-for="(uncle, index) in props.uncles" :key="index">
                                            <v-row justify="start" align="center" class="fill-height flex-nowrap">
                                                <v-card-title class="info--text p-0">Hash:</v-card-title>
                                                <app-transform-hash :hash="eth.toCheckSum(uncle)" :link="`/uncle/${uncle}`" />
                                            </v-row>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-dialog>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <!-- Next Block -->
            <v-col v-if="props.nextBlock != ''" xs="2" sm="1">
                <v-row align="center" justify="end">
                    <v-btn :to="props.nextBlock" variant="text" color="secondary" class="black--text" icon>
                        <v-icon>chevron_right</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
        <div v-else>
            <v-row align="center" justify="space-between">
                <v-col v-if="!props.isSubscribed" xs="5" sm="4">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </v-col>
                <v-col v-if="props.isSubscribed" xs="8" sm="11">
                    <v-card-title class="title font-weight-bold pl-4">This block has not been mined yet</v-card-title>
                </v-col>
                <v-col v-if="props.isSubscribed" xs="2" sm="1">
                    <v-progress-circular :size="20" color="secondary" indeterminate></v-progress-circular>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatNumber } from '@core/helper/number-format-helper'
import { eth } from '@core/helper'
import AppTransformHash from '@core/components/AppTransformHash'

const props = defineProps({
    nextBlock: String,
    prevBlock: String,
    currBlock: String,
    loading: {
        type: Boolean,
        default: false
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    uncles: Array
})

const dialog = ref(false)

const emit = defineEmits(['reload'])

/*
===================================================================================
Computed Values
===================================================================================
*/
const blockNumber = computed<string>(() => {
    return formatNumber(props.currBlock)
})

const hasUncles = computed<boolean>(() => {
    return props.uncles && props.uncles.length > 0
})

/*
===================================================================================
Methods
===================================================================================
*/
/**
 * Emit's reload to parent
 */
const reload = (): void => {
    emit('reload')
}
</script>
<style lang="scss">
.border-conatiner {
    border: 1px solid #b4bfd2;
    border-radius: 5px;
}
.nft-image-container {
    height: 160px;
    width: 160px;
    padding: 5px;
}
.float-img {
    float: left;
    margin-right: 10px;
    padding: 4px;
}
.desc-loading {
    margin-right: 10px;
    padding: 4px;
}
</style>
