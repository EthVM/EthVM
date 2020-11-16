<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile (XS-SM)
        =====================================================================================
        -->
        <v-flex xs12 hidden-md-and-up>
            <div :class="isPending ? 'table-row-mobile' : txStatusClass">
                <!--
                =====================================================================================
                  Block Number / Age / Mined indicator
                =====================================================================================
                -->
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 px-3">
                    <v-flex xs7 pa-1>
                        <router-link v-if="!isPending" :to="`/block/number/${transferObj.block}`" class="black--text font-weight-medium pb-1"
                            >{{ $t('block.number') }} {{ transaction.block }}</router-link
                        >
                        <p v-if="isPending && transaction.isMined" class="caption primary--text blinking">{{ $t('tx.mined') }}</p>
                    </v-flex>
                    <v-flex xs5 pr-44>
                        <v-layout row wrap justify-end>
                            <app-time-ago :timestamp="transaction.timestamp" />
                        </v-layout>
                    </v-flex>
                </v-layout>
                <!--
                =====================================================================================
                 Tx Hash
                =====================================================================================
                -->
                <v-layout grid-list-xs row align-center justify-start fill-height class="pt-1 pl-3 pr-4">
                    <p class="info--text tx-string px-1">{{ $tc('tx.hash', 1) }}:</p>
                    <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                </v-layout>
                <!--
                =====================================================================================
                 Addresses (From, To)
                =====================================================================================
                -->
                <v-layout grid-list-xs row align-center justify-start fill-height class="pt-2 pl-3 pr-4">
                    <p class="info--text px-1">{{ $t('tx.from') }}:</p>
                    <app-transform-hash :hash="transaction.from | toChecksum" :italic="true" :link="`/address/${transaction.from}`" />
                    <v-icon :class="[$vuetify.breakpoint.smOnly ? 'px-2' : 'px-1', 'fas fa-arrow-right primary--text']" small></v-icon>
                    <p class="info--text psmall pr-1">{{ $t('tx.to') }}:</p>
                    <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :italic="true" :link="`/address/${tx.creates}`" /> -->
                    <app-transform-hash :hash="transaction.to | toChecksum" :italic="true" :link="`/address/${transaction.to}`" />
                </v-layout>
                <!--
                =====================================================================================
                 Amount
                =====================================================================================
                -->
                <v-layout grid-list-xs row align-center justify-start fill-height class="pt-1 pb-3 px-3">
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
            </div>
        </v-flex>
        <!--
        =====================================================================================
          Desktop (MD - XL)
        =====================================================================================
        -->
        <v-flex hidden-sm-and-down sm12>
            <v-layout grid-list-xs row align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1 d-flex>
                <!--
                =====================================================================================
                 BLOCK NUMBER / HASH

                 Responsive Tally:
                 MD: 2/12 (2)
                 LG: 2/12 (2)
                =====================================================================================
                -->
                <v-flex v-if="!isPending" md2>
                    <router-link :to="`/block/number/${transferObj.block}`" class="black--text text-truncate font-italic psmall">{{
                        transaction.block
                    }}</router-link>
                </v-flex>
                <!--
                =====================================================================================
                TRANSACTION # / HASH

                Responsive Tally:
                MD: 7/12 (5)
                LG: 6/12 (4)
                =====================================================================================
                -->
                <v-flex :class="isPending ? 'md6 lg5 pr-5' : 'md5 lg4 pr-5'">
                    <v-layout row align-center justify start pr-4 pl-2 pb-2>
                        <p class="info--text tx-string pr-1">{{ $tc('tx.hash', 1) }}:</p>
                        <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                    </v-layout>
                    <v-layout row align-center justify-space-aroundstart pr-4 pl-2>
                        <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
                        <app-transform-hash :hash="transaction.from | toChecksum" :link="`/address/${transaction.from}`" :italic="true" />
                        <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                        <!-- <p v-if="tx.isContractCreation" class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p> -->
                        <p class="info--text mr-1">{{ $t('tx.to') }}:</p>
                        <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :link="`/address/${tx.creates}`" :italic="true" /> -->
                        <app-transform-hash :hash="transaction.to | toChecksum" :link="`/address/${transaction.to}`" :italic="true" />
                    </v-layout>
                </v-flex>
                <!--
                =====================================================================================
                  ETH VALUE

                  Responsive Tally:
                  MD: 9/12 (2)
                  LG: 8/12 (2)
                =====================================================================================
                -->

                <v-flex :class="isPending ? 'md3' : 'md2'">
                    <p>
                        {{ transaction.value.value }}
                        {{ $t(`common.${transaction.value.unit}`) }}
                        <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ${$t('common.eth')}`" />
                    </p>
                </v-flex>
                <!--
                =====================================================================================
                  Age

                  Responsive Tally:
                  MD: 11/12 (2)
                  LG: 10/12 (2)
                =====================================================================================
                -->
                <v-flex md2>
                    <app-time-ago :timestamp="transaction.timestamp" />
                </v-flex>
                <!--
                =====================================================================================
                  Tx Fee

                  Responsive Tally:
                  MD: 11/12 (0) - hidden
                  LG: 11/12 (1)
                =====================================================================================
                -->
                <v-flex hidden-md-and-down lg1>
                    <p :class="('black--text', 'text-truncate', 'mb-0', isPending ? 'pl-3' : '')">
                        {{ transaction.fee.value }}
                    </p>
                </v-flex>
                <!--
                =====================================================================================
                  STATUS (if !Pending) OR  MINED INDICATOR (if Pending)

                  Responsive Tally:
                  MD: 12/12 (1)
                  LG: 12/12 (1)
                =====================================================================================
                -->
                <v-flex md1>
                    <v-layout v-if="!isPending" row align-center justify-end px-3>
                        <v-icon v-if="transaction.status" small class="txSuccess--text text-xs-center">fa fa-check-circle</v-icon>
                        <v-icon v-else small class="txFail--text text-xs-center">fa fa-times-circle</v-icon>
                    </v-layout>
                    <p v-if="isPending && transaction.isMined" class="caption primary--text blinking text-xs-center">{{ $t('tx.mined') }}</p>
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
import { Tx } from './props'
import { TxSummary_transfers as TransferType } from '@app/modules/txs/handlers/BlockTxs/apolloTypes/TxSummary'
import { TxSummary_transfers_transfer as TransferObj } from '@app/modules/txs/handlers/BlockTxs/apolloTypes/TxSummary'
import { pendingTx_pendingTransaction as PendingTx } from '@app/modules/txs/handlers/PendingTxs/apolloTypes/pendingTx'

import BN from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppTimeAgo,
        AppTransformHash
    }
})
export default class TableTxsRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) tx!: TransferType
    @Prop({ type: Boolean, default: false }) isPending!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get txStatusClass(): string {
        return this.transferObj.status ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
    }

    get transferObj(): TransferObj {
        return this.tx ? this.tx.transfer : { transactionHash: '', block: 0, from: '', to: '', timestamp: 0, txFee: '', status: false, __typename: 'Transfer' }
    }

    get transaction(): Tx {
        const tx = this.isPending ? this.tx : this.transferObj
        return {
            isMined: this.isPending ? tx['isMined'] : false,
            hash: tx['transactionHash'],
            block: this.formatNumber(tx['block']),
            from: tx['from'],
            to: tx['to'],
            timestamp: new Date(tx['timestamp'] * 1e3),
            fee: this.formatNonVariableEthValue(new BN(tx['txFee'])),
            value: this.formatNonVariableEthValue(new BN(this.tx ? this.tx.value : '')),
            status: tx['status'] != null ? tx['status'] : false
        }
    }

    get isSmall(): boolean {
        return this.$vuetify.breakpoint.name === 'sm'
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

.tx-status-fail {
    border-left: 2px solid #fe1377;
}

.tx-status-sucess {
    border-left: 2px solid #40ce9c;
}
.tx-string {
    white-space: nowrap;
}

.tx-status {
    width: 60px;
}

.blinking {
    animation: blinker 2s linear infinite;
}
@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>
