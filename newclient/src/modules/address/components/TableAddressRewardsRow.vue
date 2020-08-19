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
                                <v-btn class="ml-2 mr-1 more-btn" color="white" fab depressed>
                                    <p class="info--text title pb-2">...</p>
                                </v-btn>
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
