<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile (XS)
        =====================================================================================
        -->
        <v-flex xs12 hidden-md-and-up>
            <div class="table-row-mobile">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pa-3">
                    <v-flex xs12 px-3 pt-2>
                        <v-layout row align-center justify-space-between>
                            <p v-if="miningReward">
                                + {{ miningReward.value }} {{ $t(`common.${miningReward.unit}`) }}
                                <app-tooltip v-if="miningReward.tooltipText" :text="`${miningReward.tooltipText} ${$t('common.eth')}`" />
                            </p>
                            <div class="d-flex align-center">
                                <app-time-ago v-if="rewardTimestamp" :timestamp="rewardTimestamp" />
                                <block-uncle-rewards :state="state" class="ml-2 mr-1" />
                            </div>
                        </v-layout>
                    </v-flex>
                    <v-flex v-if="!isGenesis" xs12 pb-2 px-3 pt-2>
                        <v-layout align-center row>
                            <p class="info--text tx-string caption">{{ $t('block.number') }}:</p>
                            <router-link :to="`/block/number/${reward.transfer.block}`"> {{ reward.transfer.block }}</router-link>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </div>
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
                        <block-uncle-rewards :state="state" class="ml-3 mr-1" />
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
import BlockUncleRewards from '@app/modules/address/handlers/AddressRewards/BlockUncleRewards.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'
import { TxSummary_transfers as TransferType } from '@app/modules/txs/handlers/BlockTxs/apolloTypes/TxSummary'
import BN from 'bignumber.js'
@Component({
    components: {
        AppTooltip,
        AppTimeAgo,
        AppTransformHash,
        BlockUncleRewards
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

    get state(): object {
        const stateData = [
            { name: `${this.$t('state.bal-before')}`, value: this.getBalBefore() },
            { name: this.isUncle ? `${this.$t('uncle.reward')}` : `${this.$t('block.total-reward')}`, value: this.miningReward }
        ]
        if (this.isBlock) {
            stateData.push({
                name: `${this.$t('state.fee-rewards')}`,
                value: NumberFormatHelper.formatNonVariableEthValue(new BN(this.reward.transfer.txFee))
            })
        }
        return {
            blockNumber: this.isBlock ? this.reward.transfer.block : null,
            title: `${this.reward.transfer.block}` + ' ' + (this.isBlock ? `${this.$t('state.block-rewards')}` : `${this.$t('state.uncle-rewards')}`),
            balAfter: this.getBalAfter(),
            data: stateData
        }
    }

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

    get isUncle(): boolean {
        return this.rewardType === 'uncle'
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Gets the previous balance
     * @returns {FormattedNumber}
     */
    getBalBefore(): FormattedNumber {
        if (!this.reward.stateDiff || !this.reward.stateDiff.to) {
            return { value: '0' }
        }
        return NumberFormatHelper.formatNonVariableEthValue(new BN(this.reward.stateDiff.to.before))
    }
    /**
     * Gets the after balance
     * @returns {FormattedNumber}
     */
    getBalAfter(): FormattedNumber {
        if (!this.reward.stateDiff || !this.reward.stateDiff.to) {
            return { value: '0' }
        }
        return NumberFormatHelper.formatNonVariableEthValue(new BN(this.reward.stateDiff.to.after))
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
