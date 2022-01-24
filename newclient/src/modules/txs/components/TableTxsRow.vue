<template>
    <v-layout>
        <!--
      =====================================================================================
        Mobile (XS-SM)
      =====================================================================================
      -->
        <v-flex xs12 hidden-md-and-up>
            <div :class="isPending ? 'table-row-mobile' : txStatusClass">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                    <v-flex xs6 pa-1>
                        <router-link v-if="!isPending" :to="`/block/number/${transferObj.block}`" class="black--text font-weight-medium pb-1"
                            >{{ $t('block.number') }} {{ transaction.block }}</router-link
                        >
                        <p v-if="isPending && transaction.isMined" class="caption primary--text blinking">{{ $t('tx.mined') }}</p>
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
                        <v-layout row align-center pa-2>
                            <p class="info--text psmall pr-1">{{ $tc('address.name', 2) }}:</p>
                            <app-transform-hash :hash="transaction.from | toChecksum" :italic="true" :link="`/address/${transaction.from}`" />
                            <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                            <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :italic="true" :link="`/address/${tx.creates}`" /> -->
                            <app-transform-hash
                                v-if="transaction.to && transaction.to !== ''"
                                :hash="transaction.to | toChecksum"
                                :italic="true"
                                :link="`/address/${transaction.to}`"
                            />
                            <p v-else class="info--text">{{ $t('contract.creation') }}</p>
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
            </div>
        </v-flex>
        <!--
      =====================================================================================
        Tablet/ Desktop (SM - XL)
      =====================================================================================
      -->
        <v-flex hidden-sm-and-down sm12>
            <v-layout grid-list-xs row align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                <!--
          =====================================================================================
            BLOCK NUMBER / HASH

            Responsive Tally:
            SM: 2/12 (2)
            MD: 2/12 (2)
            LG: 1/12 (1)
          =====================================================================================
          -->
                <v-flex v-if="!isPending" sm2 lg1>
                    <router-link :to="`/block/number/${transferObj.block}`" class="black--text text-truncate font-italic psmall">{{
                        transaction.block
                    }}</router-link>
                </v-flex>
                <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            SM: 9/12 (7)
            MD: 7/12 (5)
            LG: 6/12 (5)
          =====================================================================================
          -->
                <v-flex sm7 md5>
                    <v-layout row wrap align-center pr-3 pl-2>
                        <v-flex sm12>
                            <v-layout row align-center justift-start pa-2>
                                <p class="info--text tx-string">{{ $tc('tx.hash', 1) }}:</p>
                                <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                            </v-layout>
                        </v-flex>
                        <v-flex sm12>
                            <v-layout row align-center justify-space-around fill-height pa-2>
                                <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
                                <app-transform-hash :hash="transaction.from | toChecksum" :link="`/address/${transaction.from}`" :italic="true" />
                                <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                                <!-- <p v-if="tx.isContractCreation" class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p> -->
                                <p v-if="transaction.to && transaction.to !== ''" class="info--text mr-1">{{ $t('tx.to') }}:</p>
                                <p v-else class="info--text">{{ $t('contract.creation') }}</p>
                                <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :link="`/address/${tx.creates}`" :italic="true" /> -->
                                <app-transform-hash
                                    v-if="transaction.to && transaction.to !== ''"
                                    :hash="transaction.to | toChecksum"
                                    :link="`/address/${transaction.to}`"
                                    :italic="true"
                                />
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 12/12 (3)
          MD: 10/12 (3)
          LG: 8/12 (2)
          =====================================================================================
          -->
                <v-flex sm3 lg2>
                    <p :class="isPending ? 'pl-4' : ''">
                        {{ transaction.value.value }}
                        {{ $t(`common.${transaction.value.unit}`) }}
                        <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ${$t('common.eth')}`" />
                    </p>
                </v-flex>
                <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 12/12 (0)
            MD: 12/12 (2)
            lg: 10/12 (2)
          =====================================================================================
          -->
                <v-flex hidden-sm-and-down md2>
                    <app-time-ago :timestamp="transaction.timestamp" :class="isPending ? 'pl-2' : ''" />
                </v-flex>
                <!--
          =====================================================================================
            Tx Fee

            Responsive Tally:
            SM: 12/12 (0)
            MD: 12/12 (0)
            lg: 12/12 (2)
          =====================================================================================
          -->
                <v-flex hidden-md-and-down lg2>
                    <p :class="('black--text', 'text-truncate', 'mb-0', isPending ? 'pl-3' : '')">
                        {{ transaction.fee.value }}
                    </p>
                </v-flex>
                <!--
          =====================================================================================
          STATUS

          Responsive Tally:
            SM: 12/12 (1)
            MD: 12/12 (1)
            lg: 12/12 (1)
          =====================================================================================
          -->
                <div v-if="!isPending">
                    <v-icon v-if="transaction.status" small class="txSuccess--text tx-status text-xs-center">fa fa-check-circle</v-icon>
                    <v-icon v-else small class="txFail--text tx-status text-xs-center">fa fa-times-circle</v-icon>
                </div>

                <!--
          =====================================================================================
            MINED INDICATOR
          =====================================================================================
          -->
                <p v-if="isPending && transaction.isMined" class="caption primary--text blinking">{{ $t('tx.mined') }}</p>
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
    min-width: 3em;
}

.tx-status {
    min-width: 60px;
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
