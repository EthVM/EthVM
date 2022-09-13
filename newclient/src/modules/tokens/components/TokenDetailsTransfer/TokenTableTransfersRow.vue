<template>
    <v-container pa-0 ma-0>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <v-flex hidden-sm-and-down>
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                <!-- Column 1: Tx Info -->
                <v-flex :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'pr-3' : 'pr-5']" :md6="isERC721" :md7="!isERC721">
                    <v-layout row align-center justift-start pa-2>
                        <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
                        <app-transform-hash :hash="transfer.transfer.transactionHash" :link="`/tx/${transfer.transfer.transactionHash}`" />
                    </v-layout>
                    <v-layout row align-center justify-space-around fill-height pa-2>
                        <p class="info--text mr-1">{{ $t('tx.from') }}:</p>
                        <app-transform-hash :hash="transfer.transfer.from | toChecksum" :link="`/address/${transfer.transfer.from}`" :italic="true" />
                        <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                        <p v-if="transfer.transfer.contract" class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                        <p v-else class="info--text mr-1">{{ $t('tx.to') }}:</p>
                        <app-transform-hash
                            v-if="transfer.transfer.contract"
                            :hash="transfer.transfer.address | toChecksum"
                            :link="`/address/${transfer.transfer.address}`"
                            :italic="true"
                        />
                        <app-transform-hash v-else :hash="transfer.transfer.to | toChecksum" :link="`/address/${transfer.transfer.to}`" :italic="true" />
                    </v-layout>
                </v-flex>
                <!-- End Column 1 -->

                <!-- Column 2: Age -->
                <v-flex md2>
                    <app-time-ago :timestamp="date" />
                </v-flex>
                <!-- End Column 2 -->

                <!-- Column 3: Quantity/ID -->
                <v-flex md2>
                    <p class="text-truncate">
                        <span v-if="isERC721">{{ getTokenID }}</span>
                        <span v-else>{{ transferValue.value }} {{ units }} </span>
                        <app-tooltip v-if="transferValueTooltip && !isERC721" :text="transferValueTooltip" />
                    </p>
                </v-flex>
                <!-- End Column 3 -->

                <v-flex v-if="isERC721" md2>
                    <v-img :src="image" align-center justify-end max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
        <!--
    =====================================================================================
      Mobile (XS-SM)
    =====================================================================================
    -->
        <v-flex xs12 hidden-md-and-up>
            <div class="table-row-mobile mb-2">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                    <v-flex xs7>
                        <app-time-ago :timestamp="date" />
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center pa-2>
                            <p class="info--text tx-hash">{{ $tc('tx.hash', 1) }}:</p>
                            <app-transform-hash :hash="transfer.transfer.transactionHash" :link="`/tx/${transfer.transfer.transactionHash}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center pa-2>
                            <p class="info--text pr-1">{{ $tc('address.name', 2) }}:</p>
                            <app-transform-hash :hash="transfer.transfer.from | toChecksum" :italic="true" :link="`/address/${transfer.transfer.from}`" />
                            <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                            <app-transform-hash
                                v-if="transfer.transfer.contract"
                                :hash="transfer.transfer.address | toChecksum"
                                :italic="true"
                                :link="`/address/${transfer.transfer.address}`"
                            />
                            <app-transform-hash v-else :hash="transfer.transfer.to | toChecksum" :italic="true" :link="`/address/${transfer.transfer.to}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <p class="pb-0 text-truncate">
                            <span class="info--text">{{ isERC721 ? $t('common.id') : $t('common.quantity') }}: </span>
                            <span v-if="isERC721" class="text-truncate">{{ getTokenID }}</span>
                            <span v-else>{{ transferValue.value }} {{ units }}</span>
                            <app-tooltip v-if="transferValueTooltip && !isERC721" :text="transferValueTooltip" />
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
import { getERC721TokenTransfers_getERC721TokenTransfers_transfers as ERC721TokenTransfer } from '@app/modules/tokens/handlers/tokenTransfers/apolloTypes/getERC721TokenTransfers'
import { getERC20TokenTransfers_getERC20TokenTransfers_transfers as ERC20TokenTransfer } from '@app/modules/tokens/handlers/tokenTransfers/apolloTypes/getERC20TokenTransfers'
import BN from 'bignumber.js'
import configs from '@app/configs'

const TYPES = ['ERC20', 'ERC721']

@Component({
    components: {
        AppTimeAgo,
        AppTransformHash,
        AppTooltip
    }
})
export default class TokenTableTransfersRow extends Mixins(NumberFormatMixin) {
    /*
   ===================================================================================
     Props
   ===================================================================================
   */
    @Prop(Object) transfer!: ERC721TokenTransfer | ERC20TokenTransfer
    @Prop(Number) decimals?: number
    @Prop(String) symbol?: string
    @Prop(String) transferType!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    imageExists = true
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get image(): string {
        if (this.transfer && this.transfer['contract'] && this.imageExists) {
            return `${configs.OPENSEA}/getImage?contract=${this.transfer['contract']}&tokenId=${this.getTokenID}`
        }
        return require('@/assets/icon-token.png')
    }

    get transferValue(): FormattedNumber {
        let n = new BigNumber(this.transfer['value']) || new BigNumber(0)

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

    get isERC721() {
        return this.transferType === TYPES[1]
    }

    get getTokenID() {
        return new BN(this.transfer['tokenId']).toString()
    }

    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    /**
     * Sets image exists to false
     */
    onImageLoadFail(): void {
        this.imageExists = false
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
