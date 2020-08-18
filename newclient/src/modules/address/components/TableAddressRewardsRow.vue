<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile (XS)
        =====================================================================================
        -->
        <v-flex xs12 hidden-md-and-up>
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                <v-flex xs6 pa-1>
                    <router-link :to="`/block/number${transferObj.block}`" class="black--text font-weight-medium pb-1"
                        >{{ $t('block.number') }} {{ transaction.block }}</router-link
                    >
                </v-flex>
                <v-flex xs6 pr-44>
                    <v-layout row justify-end>
                        <app-time-ago :timestamp="transaction.timestamp" />
                    </v-layout>
                </v-flex>
                <v-flex xs2 pa-1>
                    <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
                </v-flex>
                <v-flex xs10 pa-1>
                    <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                </v-flex>
                <v-flex xs12 pa-1>
                    <v-layout row pa-2>
                        <p class="info--text psmall pr-1">{{ $tc('address.name', 2) }}:</p>
                        <app-transform-hash :hash="transaction.from" :italic="true" :link="`/address/${transaction.from}`" />
                        <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                        <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :italic="true" :link="`/address/${tx.creates}`" /> -->
                        <app-transform-hash :hash="transaction.to" :italic="true" :link="`/address/${transaction.to}`" />
                    </v-layout>
                </v-flex>
                <v-flex shrink pa-1>
                    <p class="info--text psmall">{{ $t('common.amount') }}:</p>
                </v-flex>
                <v-flex shrink pa-1>
                    <p class="black--text align-center">
                        {{ transaction.value.value }}
                        {{ $t(`common.${transaction.value.unit}`) }}
                        <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ${$t('common.eth')}`" />
                    </p>
                </v-flex>
            </v-layout>
        </v-flex>
        <!--
        =====================================================================================
          Tablet/ Desktop (SM - XL)
        =====================================================================================
        -->
        <v-flex hidden-sm-and-down sm12>
            <v-layout grid-list-xs row align-center justify-start fill-height pl-3 pr-3>
                <!--
                =====================================================================================
                  BLOCK INFO

                  Responsive Tally:
                  MD: 4/12 (4)
                =====================================================================================
                -->
                <v-flex v-if="!isGenesis" md4>
                    <router-link :to="`/block/number/${reward.transfer.block}`" class="black--text"> {{ reward.transfer.block }}</router-link>
                </v-flex>
                <!--
                =====================================================================================
                  AGE

                  Responsive Tally:
                  MD: 8/12 (4)
                =====================================================================================
                -->
                <v-flex md4>
                    <app-time-ago v-if="rewardTimestamp" :timestamp="rewardTimestamp" />
                </v-flex>
                <v-spacer v-if="isGenesis" />
                <!--
                =====================================================================================
                  REWARDS

                  Responsive Tally:
                  MD: 4/12 (3)
                =====================================================================================
                -->
                <v-flex md4>
                    <v-layout v-if="miningReward" row align-center justify-space-between pl-2>
                        <p>
                            + {{ miningReward.value }} {{ $t(`common.${miningReward.unit}`) }}
                            <app-tooltip v-if="miningReward.tooltipText" :text="`${miningReward.tooltipText} ${$t('common.eth')}`" />
                        </p>
                        <v-btn class="ml-3 mr-1 more-btn" color="white" fab depressed>
                            <p class="info--text title pb-2">...</p>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { TxSummary_transfers as TransferType } from '@app/modules/txs/handlers/BlockTxs/apolloTypes/TxSummary'
import BN from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppTimeAgo,
        AppTransformHash
    }
})
export default class TableAddressRewardsRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) reward!: any
    @Prop(String) rewardType!: string

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get miningReward(): FormattedNumber | null {
        if (this.reward) {
            const _reward = new BN(this.reward.value)
            return this.formatNonVariableEthValue(_reward)
        }
        return null
    }
    get rewardTimestamp(): Date | null {
        if (this.reward) {
            return new Date(this.reward.transfer.timestamp * 1e3)
        }
        return null
    }

    get isGenesis(): boolean {
        return this.rewardType === 'genesis'
    }

    get isBlock(): boolean {
        return this.rewardType === 'block'
    }
}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

p {
    margin-bottom: 0px;
    padding-bottom: 0px;
}

.tx-string {
    min-width: 3em;
}

.more-btn {
    height: 20px;
    width: 20px;
}
</style>
