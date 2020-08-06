<template>
    <v-container pa-0 ma-0>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <v-flex hidden-xs-only>
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                <!-- Column 1: Tx Info -->
                <v-flex :class="[$vuetify.breakpoint.name === 'sm' ? 'pr-3' : 'pr-5']" sm6 md7>
                    <v-layout row align-center justift-start pa-2>
                        <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
                        <app-transform-hash :hash="transfer.transfer.transactionHash" :link="`/tx/${transfer.transfer.transactionHash}`" />
                    </v-layout>
                    <v-layout row align-center justify-space-around fill-height pa-2>
                        <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
                        <app-transform-hash :hash="transfer.transfer.from" :link="`/address/${transfer.transfer.from}`" :italic="true" />
                        <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                        <p v-if="transfer.transfer.contract" class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                        <p v-else class="info--text mr-1">{{ $t('tx.to') }}:</p>
                        <app-transform-hash
                            v-if="transfer.transfer.contract"
                            :hash="transfer.transfer.address"
                            :link="`/address/${transfer.transfer.address}`"
                            :italic="true"
                        />
                        <app-transform-hash v-else :hash="transfer.transfer.to" :link="`/address/${transfer.transfer.to}`" :italic="true" />
                    </v-layout>
                </v-flex>
                <!-- End Column 1 -->

                <!-- Column 2: Age -->
                <v-flex sm2>
                    <app-time-ago :timestamp="date" />
                </v-flex>
                <!-- End Column 2 -->

                <!-- Column 3: Quantity -->
                <v-flex sm2>
                    <p>
                        {{ transferValue.value }} {{ units }}
                        <app-tooltip v-if="transferValueTooltip" :text="transferValueTooltip" />
                    </p>
                </v-flex>
                <!-- End Column 3 -->
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
        <!--
    =====================================================================================
      Mobile (XS)
    =====================================================================================
    -->
        <v-flex xs12 hidden-sm-and-up>
            <div class="table-row-mobile mb-2">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                    <v-flex xs7>
                        <app-time-ago :timestamp="date" />
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row pa-2>
                            <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
                            <app-transform-hash :hash="transfer.transfer.transactionHash" :link="`/tx/${transfer.transfer.transactionHash}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row pa-2>
                            <p class="info--text pr-1">{{ $tc('address.name', 2) }}:</p>
                            <app-transform-hash :hash="transfer.transfer.from" :italic="true" :link="`/address/${transfer.transfer.from}`" />
                            <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                            <app-transform-hash
                                v-if="transfer.transfer.contract"
                                :hash="transfer.transfer.address"
                                :italic="true"
                                :link="`/address/${transfer.transfer.address}`"
                            />
                            <app-transform-hash v-else :hash="transfer.transfer.to" :italic="true" :link="`/address/${transfer.transfer.to}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <p class="pb-0">
                            <span class="info--text">{{ $t('common.quantity') }}:</span> {{ transferValue.value }} {{ units }}
                            <app-tooltip v-if="transferValueTooltip" :text="transferValueTooltip" />
                        </p>
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
    </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { EthValue } from '@app/core/models'
import BigNumber from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'

@Component({
    components: {
        AppTimeAgo,
        AppTransformHash,
        AppTooltip
    }
})
export default class TransfersTableRow extends Mixins(NumberFormatMixin) {
    /*
   ===================================================================================
     Props
   ===================================================================================
   */
    @Prop(Object) transfer!: any
    @Prop(Number) decimals?: number
    @Prop(String) symbol?: string

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    get transferValue(): FormattedNumber {
        let n = new BigNumber(this.transfer.value) || new BigNumber(0)

        // Must be a token transfer
        if (this.decimals) {
            n = n.div(new BigNumber(10).pow(this.decimals))
        }
        return this.formatFloatingPointValue(n)
    }

    get units(): string | undefined {
        return this.symbolFormatted
    }

    get date(): Date {
        return new Date(this.transfer.transfer.timestamp * 1e3)
    }

    get symbolFormatted(): string | undefined {
        return this.symbol ? this.symbol.toUpperCase() : undefined
    }

    get transferValueTooltip(): string | undefined {
        const { tooltipText } = this.transferValue
        if (!tooltipText) {
            return undefined
        }
        return `${tooltipText} ${this.symbolFormatted}`
    }
}
</script>
<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

.tx-hash {
    min-width: 3em;
}
</style>
