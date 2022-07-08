<template>
    <div>
        <v-row v-if="!loading" align="center" justify="start" class="mt-1 mb-1 mx-0 py-3">
            <!-- Previous Block -->
            <v-col xs="2" sm="1">
                <v-row v-if="prevBlock != ''" align="center" justify="start">
                    <v-btn :to="prevBlock" variant="text" color="secondary" class="black--text" icon @click="reload()">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
            <!-- Title -->
            <v-col xs="8" sm="10" class="pl-0 pr-0">
                <v-row align="start" justify="start" class="mx-0">
                    <v-col xs="12">
                        <v-row row wrap align="center" justify="start">
                            <v-card-title class="title font-weight-bold py-1 pl-1">Block #{{ blockNumber }} </v-card-title>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <!-- Next Block -->
            <v-col v-if="nextBlock != ''" xs="2" sm="1">
                <v-row align="center" justify="end">
                    <v-btn :to="nextBlock" variant="text" color="secondary" class="black--text" icon>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
        <div v-else>
            <v-row align="center" justify="space-between">
                <v-col v-if="!isSubscribed" xs="5" sm="4">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </v-col>
                <v-col v-if="isSubscribed" xs="8" sm="11">
                    <v-card-title class="title font-weight-bold pl-4">This block has not been mined yet</v-card-title>
                </v-col>
                <v-col v-if="isSubscribed" xs="2" sm="1">
                    <v-progress-circular :size="20" color="secondary" indeterminate></v-progress-circular>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@core/helper/number-format-helper'

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
    }
})

const emit = defineEmits(['reload'])

/*
===================================================================================
Computed Values
===================================================================================
*/
const blockNumber = computed<string>(() => {
    return formatNumber(props.currBlock)
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
