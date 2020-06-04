<template>
    <v-layout>
        <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
        <v-flex xs12 hidden-md-and-up>
            <div :class="txStatusClass">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                    <v-flex xs6 pa-1>
                        <p :class="[tx.transfer.status ? 'black--text' : 'info--text', 'caption']">
                            {{ amountSign }}{{ transaction.value.value }}
                            {{ $t(`common.${transaction.value.unit}`) }}
                            <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ${$t('common.eth')}`" />
                        </p>
                    </v-flex>
                    <v-flex xs6>
                        <v-layout row align-center justify-end>
                            <app-time-ago :timestamp="transaction.timestamp" class="info--text caption" />
                            <v-btn class="ml-2 mr-1 more-btn" color="white" fab depressed>
                                <p class="info--text title pb-2">...</p>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center justift-start pa-1>
                            <p class="info--text tx-string caption">{{ $tc('tx.hash', 1) }}:</p>
                            <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs5 sm3 pa-1>
                        <v-card :color="typeColor" flat>
                            <p class="white--text text-xs-center caption pa-1">{{ typeString }}</p>
                        </v-card>
                    </v-flex>
                    <v-flex xs7 sm9 pa-1>
                        <app-transform-hash :hash="typeAddr" :link="`/address/${typeAddr}`" />
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
            <v-layout grid-list-xs row align-center justify-start fill-height>
                <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            MD: 5/12 (5)
            Lg: 5/12 (5)
          =====================================================================================
          -->
                <v-flex md5>
                    <v-layout row wrap align-center pl-3>
                        <v-flex sm12>
                            <v-layout row align-center justift-start pa-2>
                                <p class="info--text tx-string">{{ $tc('tx.hash', 1) }}:</p>
                                <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                            </v-layout>
                        </v-flex>
                        <v-flex sm12 pt-0 pb-0>
                            <v-layout row align-center justify-start fill-height>
                                <v-flex sm5 lg4>
                                    <v-card :color="typeColor" flat>
                                        <p class="white--text text-sm-center caption pa-1">{{ typeString }}</p>
                                    </v-card>
                                </v-flex>
                                <v-flex sm7 lg8 pl-0>
                                    <app-transform-hash :hash="typeAddr" :link="`/address/${typeAddr}`" :italic="true" />
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          MD: 8/12 (3)
          LG: 7/2 (2)
          =====================================================================================
          -->
                <v-flex md3 lg2>
                    <v-layout row wrap align-center pl-1 pr->
                        <v-flex sm12>
                            <p :class="[tx.transfer.status ? 'black--text' : 'info--text']">
                                <span class="hidden-lg-and-up info--text pr-1">{{ $t('common.amount') }}:</span>
                                {{ amountSign }}{{ transaction.value.value }}
                                {{ $t(`common.${transaction.value.unit}`) }}
                                <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ${$t('common.eth')}`" />
                            </p>
                        </v-flex>
                        <v-flex sm12 hidden-lg-and-up>
                            <p :class="[type === 'out' ? 'black--text' : 'info--text', 'text-truncate mb-0']">
                                <span class="info--text pr-1">{{ $tc('tx.fee', 1) }}: </span><span v-if="transaction.status && type === 'out'">-</span
                                >{{ transaction.fee.value }}
                            </p>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
          =====================================================================================
            Tx Fee

            Responsive Tally:
            SM: 10/12 (0)
            MD: 9/12 (0)
            LG: 9/2 (2)
          =====================================================================================
          -->
                <v-flex hidden-md-and-down lg2>
                    <p :class="[type === 'out' ? 'black--text' : 'info--text', 'text-truncate mb-0']">
                        <span v-if="transaction.status && type === 'out'">-</span>{{ transaction.fee.value }}
                    </p>
                </v-flex>
                <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 11/12 (1)
            MD: 11/12 (2)
            LG: 11/2 (2)
          =====================================================================================
          -->
                <v-flex md3 lg2>
                    <app-time-ago :timestamp="transaction.timestamp" />
                </v-flex>

                <!--
          =====================================================================================
          More

          Responsive Tally:
            SM: 12/12 (1)
            MD: 12/12 (1)
            LG: 12/12 (1)
          =====================================================================================
          -->
                <v-flex shrink>
                    <v-layout row align-center justify-end>
                        <v-icon v-if="transaction.status" small class="txSuccess--text">fa fa-check-circle</v-icon>
                        <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
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
import { TxSummary_transfers as TransferType } from '@app/modules/txs/handlers/BlockTxs/TxSummary.type'
import BN from 'bignumber.js'
const TYPES = ['in', 'out', 'self']

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
    @Prop(String) address!: string
    @Prop({ type: Boolean, default: false }) isPending

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get txStatusClass(): string {
        return this.tx.transfer.status ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
    }

    get transaction(): any {
        return {
            hash: this.tx.transfer.transactionHash,
            from: this.tx.transfer.from,
            to: this.tx.transfer.to,
            timestamp: new Date(this.tx.transfer.timestamp * 1e3),
            fee: this.formatNonVariableEthValue(new BN(this.tx.transfer.txFee)),
            value: this.formatNonVariableEthValue(new BN(this.tx.value)),
            status: this.tx.transfer.status != null ? this.tx.transfer.status : false
        }
    }
    get isSmall(): boolean {
        return this.$vuetify.breakpoint.name === 'sm'
    }

    get type(): string {
        const from = this.tx.transfer.from.toLowerCase()
        const to = this.tx.transfer.to.toLowerCase()
        const addr = this.address.toLowerCase()

        if (addr === from && addr === to) {
            return TYPES[2]
        } else if (addr === from) {
            return TYPES[1]
        }
        return TYPES[0]
    }

    get typeString(): string {
        switch (this.type) {
            case TYPES[0]:
                return `${this.$t('tx.type.in')}`
            case TYPES[1]:
                return `${this.$t('tx.type.out')}`
            default:
                return `${this.$t('tx.type.self')}`
        }
    }
    get typeColor(): string {
        switch (this.type) {
            case TYPES[0]:
                return 'primary'
            case TYPES[1]:
                return 'error'
            default:
                return 'info'
        }
    }
    get typeAddr(): string {
        switch (this.type) {
            case TYPES[0]:
                return this.tx.transfer.from
            case TYPES[1]:
                return this.tx.transfer.to
            default:
                return this.address
        }
    }

    get amountSign(): string {
        if (this.tx.transfer.status) {
            if (this.type === TYPES[0]) {
                return '+'
            }
            if (this.type === TYPES[1]) {
                return '-'
            }
        }
        return ''
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
.more-btn {
    height: 20px;
    width: 20px;
}
</style>
