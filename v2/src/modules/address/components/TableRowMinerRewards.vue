<template>
    <app-table-row row-align="center">
        <!-- Blocks Mined-->
        <v-col cols="7" sm="3">
            <v-row class="d-flex flex-sm-column ma-0 text-caption text-sm-body-1">
                <v-col cols="6" sm="12" class="pa-0">
                    <router-link :to="`/block/number/${props.reward.transfer.block}`" class="text-secondary">
                        {{ props.reward.transfer.block }}
                    </router-link>
                </v-col>
                <v-col cols="6" sm="12" class="pa-0 pt-sm-1">
                    <p class="text-info font-regular">
                        {{ timeAgo(new Date(props.reward.transfer.timestamp) * 1e3, xs) }}
                    </p>
                </v-col>
            </v-row>
        </v-col>
        <!-- Mined Rewards -->
        <v-col cols="5" sm="3">
            <p class="text-right text-sm-left">+ {{ miningReward.value }} {{ currencyName }}</p>
        </v-col>
        <!-- Balance Before -->
        <v-col md="3" class="d-none d-sm-block"> {{ getRewardBalanceBefore.value }} {{ currencyName }} </v-col>
        <!-- Balance After -->
        <v-col md="3" class="d-none d-sm-block"> {{ getRewardBalanceAfter.value }} {{ currencyName }} </v-col>
    </app-table-row>
</template>

<script setup lang="ts">
import AppTableRow from '@core/components/AppTableRow.vue'
import { timeAgo } from '@core/helper'
import { RewardTransferFragment } from '../apollo/AddressRewards/rewards.generated'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { xs } = useDisplay()
const { currencyName } = useNetwork()

interface ComponentProps {
    reward: RewardTransferFragment
}

const props = defineProps<ComponentProps>()

const miningReward = computed<FormattedNumber | null>(() => {
    if (props.reward) {
        const _reward = new BN(props.reward.value)
        return formatNonVariableEthValue(_reward)
    }
    return null
})

const getRewardBalanceBefore = computed<FormattedNumber | null>(() => {
    if (props.reward.stateDiff && props.reward.stateDiff.to) {
        return formatNonVariableEthValue(new BN(props.reward.stateDiff.to.before))
    }
    return { value: '0' }
})

const getRewardBalanceAfter = computed<FormattedNumber | null>(() => {
    if (props.reward.stateDiff && props.reward.stateDiff.to) {
        return formatNonVariableEthValue(new BN(props.reward.stateDiff.to.after))
    }
    return { value: '0' }
})
</script>
