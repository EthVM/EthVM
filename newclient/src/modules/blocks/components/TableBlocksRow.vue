<template>
    <v-container pa-0>
        <v-layout d-block>
            <!--
      =====================================================================================
        Mobile (XS-SM)
      =====================================================================================
      -->
            <v-flex xs12 hidden-md-and-up>
                <div class="table-row-mobile">
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-4 pl-4">
                        <v-flex xs6 pa-1>
                            <router-link :to="`/block/number/${block.number}`" class="black--text font-weight-medium pb-1"
                                >{{ $t('block.number') }} {{ _block.number }}</router-link
                            >
                        </v-flex>
                        <v-flex xs6 pr-44>
                            <v-layout row justify-end>
                                <p class="black--text align-center pl-2">
                                    {{ _block.totalTx }} {{ $tc('tx.name-short', 2) }}
                                    <app-tooltip v-if="_block.txFail > 0" :text="txTooltipText" />
                                </p>
                            </v-layout>
                        </v-flex>
                        <v-flex xs2 pa-1>
                            <p class="info--text psmall">{{ $t('common.age') }}:</p>
                        </v-flex>
                        <v-flex xs10 pa-1>
                            <app-time-ago :timestamp="_block.timestamp" />
                        </v-flex>
                        <v-flex xs2 pa-1>
                            <p class="info--text psmall pr-1">{{ $t('miner.name') }}:</p>
                        </v-flex>
                        <v-flex xs10 pa-1>
                            <app-transform-hash :hash="_block.miner | toChecksum" :italic="true" :link="`/address/${_block.miner}`" />
                        </v-flex>
                        <v-flex xs2 pa-1>
                            <p class="info--text psmall">{{ $t('miner.reward-short') }}:</p>
                        </v-flex>
                        <v-flex xs10 pa-1>
                            <p class="black--text align-center pl-2">
                                {{ _block.rewards.value }}
                                <app-tooltip v-if="_block.rewards.tooltipText" :text="`${_block.rewards.tooltipText} ${$t('common.eth')}`" />
                            </p>
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
                <!--
        =====================================================================================
          Block Info
        =====================================================================================
        -->
                <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                    <v-flex sm2>
                        <router-link :to="`/block/number/${block.number}`" class="black--text pb-1">{{ _block.number }}</router-link>
                    </v-flex>
                    <v-flex sm5>
                        <v-layout row align-center pb-2>
                            <p class="info--text pr-1">{{ $t('miner.name') }}:</p>
                            <app-transform-hash :hash="_block.miner | toChecksum" :italic="true" :link="`/address/${_block.miner}`" />
                        </v-layout>
                        <v-layout row>
                            <p class="info--text psmall pr-2">{{ $t('common.age') }}:</p>
                            <app-time-ago :timestamp="_block.timestamp" />
                        </v-layout>
                    </v-flex>
                    <v-spacer hidden-xl-only />
                    <v-flex sm2>
                        <p class="pr-1">
                            {{ _block.totalTx }}
                            <app-tooltip v-if="_block.txFail > 0" :text="txTooltipText" />
                        </p>
                    </v-flex>
                    <v-flex sm2>
                        <p class="black--text align-center mb-0">
                            {{ _block.rewards.value }}
                            <app-tooltip v-if="_block.rewards.tooltipText" :text="`${_block.rewards.tooltipText} ${$t('common.eth')}`" />
                        </p>
                    </v-flex>
                </v-layout>
                <v-divider class="mb-2 mt-2" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'

import BN from 'bignumber.js'

import AppTooltip from '@app/core/components/ui/AppTooltip.vue'

@Component({
    components: {
        AppTooltip,
        AppTransformHash,
        AppTimeAgo
    }
})
export default class TableBlocksRow extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) block!: any

    /*
  ===================================================================================
   Computed
  ===================================================================================
  */

    get _block(): any {
        return {
            number: this.formatNumber(this.block.number),
            miner: this.block.miner,
            rewards: this.formatNonVariableEthValue(new BN(this.block.rewards.total)),
            timestamp: new Date(this.block.timestamp * 1e3),
            totalTx: this.formatNumber(this.block.txCount),
            txFail: this.formatNumber(this.block.txFail),
            txSuccess: this.formatNumber(this.block.txCount - this.block.txFail)
        }
    }
    get txTooltipText(): string {
        return `${this._block.txSuccess} ${this.$tc('tx.success', this.sucessTransalate())}, ${this._block.txFail} ${this.$tc(
            'tx.failed',
            this.failedTranslate()
        )}`
    }
    /*
  ===================================================================================
   Methods
  ===================================================================================
  */
    /**
     * Called when translation is success
     * @returns {Number}
     */
    sucessTransalate(): number {
        return this._block && this._block.txSuccess > 1 ? 2 : 1
    }
    /**
     * Called when translation is fails
     * @returns {Number}
     */
    failedTranslate(): number {
        return this.block && this._block.txFail > 1 ? 2 : 1
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
.arrow {
    position: relative;
}

.line {
    border-left: 1px solid #b4bfd2;
    border-bottom: 1px solid #b4bfd2;
    height: 50px;
    width: 105%;
    position: absolute;
    margin-left: 2px;
    margin-bottom: 10px;
}
</style>
