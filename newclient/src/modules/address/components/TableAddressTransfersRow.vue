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
                    <v-flex xs5 pa-1> </v-flex>
                    <v-flex xs7 pa-1>
                        <v-layout row align-center justify-end>
                            <app-time-ago :timestamp="tokenTransfer.timestamp" />
                            <app-state-diff v-if="isErc20" :state="state" class="ml-2 mr-1" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs2 sm1>
                        <v-layout row align-center justify-center>
                            <div class="token-image-mobile">
                                <v-img :src="image" contain @error="imgLoadFail" />
                            </div>
                        </v-layout>
                    </v-flex>
                    <v-flex xs10 sm11 pa-0>
                        <v-layout grid-list-xs row wrap align-center justify-start fill-height pb-2 pl-3>
                            <v-flex xs12 pb-1>
                                <router-link
                                    v-if="tokenTransfer.name !== '' || tokenTransfer.symbol"
                                    :to="`/token/${transfer.contract}`"
                                    class="black--text subtitle-2 font-weight-medium"
                                >
                                    <p v-if="tokenTransfer.name">{{ tokenTransfer.name }}</p>
                                    <p v-else class="text-uppercase">{{ tokenTransfer.symbol }}</p>
                                </router-link>
                                <v-layout v-else row align-center justift-start pa-1>
                                    <p class="info--text contract-string caption mr-1">{{ $tc('contract.name', 1) }}:</p>
                                    <app-transform-hash :hash="transfer.contract | toChecksum" :link="`/address/${transfer.contract}`" />
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row align-center justift-start pr-2 pl-2>
                                    <p v-if="isErc20" class="black--text">
                                        {{ amountSign }}{{ amount.value }}
                                        <span v-if="isErc20 && tokenTransfer.symbol" class="info--text caption pr-1">{{ tokenTransfer.symbol }}</span>
                                        <app-tooltip v-if="isErc20 && amount.tooltipText" :text="`${amount.tooltipText} ${tokenTransfer.symbol}`" />
                                    </p>
                                    <p v-else class="black--text caption text-truncate">
                                        {{ amount }}
                                    </p>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center justift-start pa-1>
                            <p class="info--text tx-string caption">{{ $tc('tx.hash', 1) }}:</p>
                            <app-transform-hash :hash="tokenTransfer.hash" :link="`/tx/${tokenTransfer.hash}`" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 pt-1>
                        <v-layout row align-center justify-start fill-height pr-6>
                            <v-flex xs5 sm3 pr-1 pl-1>
                                <v-card :color="typeColor" flat>
                                    <p class="white--text text-xs-center caption pa-1">{{ typeString }}</p>
                                </v-card>
                            </v-flex>
                            <v-flex xs7 sm9 pl-1>
                                <app-transform-hash :hash="typeAddr | toChecksum" :link="`/address/${typeAddr}`" :italic="true" />
                            </v-flex>
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
            <v-layout grid-list-xs row align-center justify-start fill-height>
                <!--
          =====================================================================================
            TOKEN NAME/IMAGE

            Responsive Tally:
            MD: 5/12 (5)
            Lg: 5/12 (5)
          =====================================================================================
          -->
                <v-flex md3>
                    <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-2>
                        <div class="token-image">
                            <v-img :src="image" contain @error="imgLoadFail" />
                        </div>
                        <router-link v-if="tokenTransfer.name !== '' || tokenTransfer.symbol" :to="`/token/${transfer.contract}`" class="black--text">
                            <p v-if="tokenTransfer.name">{{ tokenTransfer.name }}</p>
                            <p v-else class="text-uppercase caption">{{ tokenTransfer.symbol }}</p>
                        </router-link>
                        <app-transform-hash v-else :hash="transfer.contract | toChecksum" :link="`/address/${transfer.contract}`" />
                    </v-layout>
                </v-flex>
                <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            MD: 5/12 (5)
            Lg: 5/12 (5)
          =====================================================================================
          -->
                <v-flex md4>
                    <v-layout row wrap align-center pl-1>
                        <v-flex sm12>
                            <v-layout row align-center justift-start pa-2>
                                <p class="info--text tx-string">{{ $tc('tx.hash', 1) }}:</p>
                                <app-transform-hash :hash="tokenTransfer.hash" :link="`/tx/${tokenTransfer.hash}`" />
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
                                    <app-transform-hash :hash="typeAddr | toChecksum" :link="`/address/${typeAddr}`" :italic="true" />
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
          =====================================================================================
          AMOUNT/ TOKEN ID

          Responsive Tally:
          MD: 8/12 (3)
          LG: 7/2 (2)
          =====================================================================================
          -->
                <v-flex md3>
                    <v-layout row wrap align-center pl-1>
                        <v-flex sm12>
                            <p v-if="isErc20" class="black--text">
                                {{ amountSign }}{{ amount.value }}
                                <span v-if="isErc20 && tokenTransfer.symbol" class="info--text caption pr-1">{{ tokenTransfer.symbol }}</span>
                                <app-tooltip v-if="isErc20 && amount.tooltipText" :text="`${amount.tooltipText} ${tokenTransfer.symbol}`" />
                            </p>
                            <p v-else class="text-truncate">
                                {{ amount }}
                            </p>
                        </v-flex>
                    </v-layout>
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
                <v-flex md2>
                    <v-layout row flex-nowrap align-center justify-space-between pr-3>
                        <app-time-ago :timestamp="tokenTransfer.timestamp" />
                        <app-state-diff v-if="isErc20" :state="state" />
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppStateDiff from '@app/core/components/ui/AppStateDiff.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'
import { TxSummary_transfers as TransferType } from '@app/modules/txs/handlers/BlockTxs/apolloTypes/TxSummary'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import BN from 'bignumber.js'
import configs from '@app/configs'

const TYPES = ['in', 'out', 'self']

@Component({
    components: {
        AppTooltip,
        AppTimeAgo,
        AppTransformHash,
        AppStateDiff
    }
})
export default class TableTxsRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) transfer!: any
    @Prop(String) address!: string
    @Prop(Object) tokenImage!: TokenMarketData | undefined
    @Prop(Boolean) isErc20!: boolean

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
    get state(): object {
        return {
            status: true,
            balAfter: this.getStateVal(this.getBalAfter()),
            data: [
                { name: `${this.$t('state.bal-before')}`, value: this.getStateVal(this.getBalBefore()) },
                {
                    name: this.getValueTitle,
                    value: this.getStateVal(this.getValue(this.transfer.value))
                }
            ]
        }
    }

    get getValueTitle(): string {
        if (this.type === TYPES[1]) {
            return `${this.$t('state.val-sent')}`
        }
        if (this.type === TYPES[0]) {
            return `${this.$t('state.val-received')}`
        }
        return `${this.$t('state.actual-sent-received')}`
    }

    get tokenTransfer(): any {
        return {
            image: this.tokenImage ? this.tokenImage.image : null,
            symbol: this.transfer.tokenInfo.symbol,
            contract: this.transfer.contract,
            hash: this.transfer.transfer.transactionHash,
            from: this.transfer.transfer.from,
            to: this.transfer.transfer.to,
            timestamp: new Date(new BN(this.transfer.transfer.timestamp).multipliedBy(1e3).toNumber()),
            name: this.transfer.tokenInfo.name
        }
    }
    /*NOTE:  Add Token Image from tokens, when implemented */
    get image(): any {
        if (this.isErc20) {
            return this.tokenTransfer.image || require('@/assets/icon-token.png')
        }
        if (this.imageExists && this.transfer) {
            return `${configs.OPENSEA}/getImage?contract=${this.transfer.contract}&tokenId=${this.getTokenID().toString()}`
        }
        return require('@/assets/icon-token.png')
    }

    get amount(): FormattedNumber | string {
        if (this.isErc20) {
            return this.formatFloatingPointValue(this.getValue(this.transfer.value))
        }
        return this.formatNumber(new BN(this.transfer.tokenId).toNumber())
    }
    get isSmall(): boolean {
        return this.$vuetify.breakpoint.name === 'sm'
    }

    get type(): string {
        const from = this.transfer.transfer.from.toLowerCase()
        const to = this.transfer.transfer.to.toLowerCase()
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
                return this.tokenTransfer.from
            case TYPES[1]:
                return this.tokenTransfer.to
            default:
                return this.address
        }
    }

    get amountSign(): string {
        if (this.type === TYPES[0]) {
            return '+'
        }
        if (this.type === TYPES[1]) {
            return '-'
        }

        return ''
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Gets value based on whether decimals exists
     * @param value {Number}
     * @returns {BN}
     */
    getValue(value: string): BN {
        let n = new BN(value)
        if (this.transfer.tokenInfo.decimals) {
            n = n.div(new BN(10).pow(this.transfer.tokenInfo.decimals))
        }
        return n
    }
    /**
     * Gets balance before
     * @returns {BN} or {String}
     */
    getBalBefore(): BN | string {
        if (!this.transfer.stateDiff) {
            return '0'
        }

        return this.type === TYPES[1] && this.transfer.stateDiff.from
            ? this.getValue(this.transfer.stateDiff.from.before)
            : this.getValue(this.transfer.stateDiff.to.before)
    }
    /**
     * Gets balance after
     * @returns {BN} or {String}
     */
    getBalAfter(): BN | string {
        if (!this.transfer.stateDiff) {
            return '0'
        }
        return this.type === TYPES[1] && this.transfer.stateDiff.from
            ? this.getValue(this.transfer.stateDiff.from.after)
            : this.getValue(this.transfer.stateDiff.to.after)
    }
    /**
     * Gets value from state
     * @param value {BN}
     * @returns {Object}
     */
    getStateVal(val: BN | string): object {
        const _val = new BN(val)
        return {
            value: this.formatFloatingPointValue(_val).value,
            unit: this.transfer.tokenInfo.symbol
        }
    }
    /**
     * Gets token ID
     * @returns {String}
     */
    getTokenID(): string {
        return new BN(this.transfer.tokenId).toString()
    }

    /**
     * Image loading failed catcher
     */
    imgLoadFail(): void {
        this.imageExists = false
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
.contract-string {
    min-width: 4em;
}
.more-btn {
    height: 20px;
    width: 20px;
}
</style>
